"use client";

import React, { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import {
  ArrowBigUp,
  Crown,
  FileText,
  MessageSquare,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { useGetAllPost, useDeletePost } from "@/src/hooks/post";
import Loading from "@/src/components/shared/Loading";
import AdminPageHeader from "@/src/components/shared/AdminPageHeader";
import { TPost } from "@/src/types/post";

const columns = [
  { name: "POST", uid: "title" },
  { name: "AUTHOR", uid: "author" },
  { name: "CATEGORY", uid: "category" },
  { name: "ENGAGEMENT", uid: "engagement" },
  { name: "DATE", uid: "date" },
  { name: "ACTIONS", uid: "actions" },
];

const formatDate = (d?: string) => {
  if (!d) return "—";
  const date = new Date(d);

  if (isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const stripHtml = (s?: string) => (s || "").replace(/<[^>]*>/g, "").trim();

export default function ContentModeration() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAllPost({});
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<TPost | null>(null);

  const posts: TPost[] = data?.data || [];

  const stats = useMemo(() => {
    const premium = posts.filter((p) => p.isPremium).length;
    const flagged = posts.filter((p) => (p.downvotes?.length || 0) >= 3).length;

    return { total: posts.length, premium, flagged };
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return posts;

    return posts.filter(
      (p) =>
        stripHtml(p.title).toLowerCase().includes(q) ||
        p.user?.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  }, [posts, search]);

  const askDelete = (post: TPost) => {
    setTarget(post);
    onOpen();
  };

  const confirmDelete = () => {
    if (!target?._id) return;
    deletePost(target._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_ALL_POST"] });
        onClose();
        setTarget(null);
      },
    });
  };

  const renderCell = React.useCallback((post: any, columnKey: string) => {
    const flagged = (post.downvotes?.length || 0) >= 3;

    switch (columnKey) {
      case "title":
        return (
          <div className="flex items-center gap-3 max-w-[260px]">
            {post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                src={post.imageUrl}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-green-500" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {stripHtml(post.title) || "Untitled"}
              </p>
              {flagged && (
                <span className="text-[11px] font-medium text-red-500 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Needs review
                </span>
              )}
            </div>
          </div>
        );
      case "author":
        return (
          <User
            avatarProps={{ radius: "lg", src: post.user?.profilePhoto }}
            name={post.user?.name || "Unknown"}
          />
        );
      case "category":
        return (
          <Chip className="capitalize" size="sm" variant="flat">
            {post.category || "—"}
          </Chip>
        );
      case "engagement":
        return (
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1">
              <ArrowBigUp className="w-4 h-4 text-green-500" />
              {post.upvotes?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              {post.comments?.length || 0}
            </span>
            {post.isPremium && <Crown className="w-4 h-4 text-amber-500" />}
          </div>
        );
      case "date":
        return (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatDate(post.createdAt)}
          </p>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end">
            <Button
              color="danger"
              size="sm"
              startContent={<Trash2 className="w-4 h-4" />}
              variant="flat"
              onClick={() => askDelete(post)}
            >
              Remove
            </Button>
          </div>
        );
      default:
        return null;
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const statCards = [
    {
      label: "Total Posts",
      value: stats.total,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Needs Review",
      value: stats.flagged,
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Premium Posts",
      value: stats.premium,
      icon: Crown,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageHeader
        icon={ShieldCheck}
        subtitle="Review community posts and remove anything that breaks the rules"
        title="Content Moderation"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3"
          >
            <div className={`p-2.5 rounded-xl ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {s.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
        <div className="mb-4 max-w-xs">
          <Input
            placeholder="Search posts, authors, categories"
            size="sm"
            startContent={<Search className="w-4 h-4 text-gray-400" />}
            value={search}
            variant="bordered"
            onValueChange={setSearch}
          />
        </div>

        <Table aria-label="Content moderation table" removeWrapper>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "end" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent="No posts to review." items={filtered}>
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey as string)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Remove confirmation */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Remove this post?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This removes
                  <span className="font-semibold">
                    {" "}
                    “{stripHtml(target?.title) || "this post"}”
                  </span>{" "}
                  by {target?.user?.name || "Unknown"} from the community. This
                  action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleting}
                  onPress={confirmDelete}
                >
                  Remove post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
