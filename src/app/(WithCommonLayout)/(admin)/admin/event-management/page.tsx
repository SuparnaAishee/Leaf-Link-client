"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
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
  CalendarClock,
  CalendarDays,
  History,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import { useEvents, useDeleteEvent } from "@/src/hooks/event";
import Loading from "@/src/components/shared/Loading";
import AdminPageHeader from "@/src/components/shared/AdminPageHeader";

type TAdminEvent = {
  _id: string;
  title: string;
  location?: string;
  date: string;
  host?: { name?: string; profilePhoto?: string };
  attendees?: unknown[];
};

const columns = [
  { name: "EVENT", uid: "title" },
  { name: "HOST", uid: "host" },
  { name: "DATE", uid: "date" },
  { name: "RSVPS", uid: "rsvps" },
  { name: "STATUS", uid: "status" },
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

export default function EventManagement() {
  const { data, isLoading } = useEvents("all");
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<TAdminEvent | null>(null);

  const events: TAdminEvent[] = data?.data || [];

  const stats = useMemo(() => {
    const now = Date.now();
    const upcoming = events.filter(
      (e) => new Date(e.date).getTime() >= now,
    ).length;
    const rsvps = events.reduce((s, e) => s + (e.attendees?.length || 0), 0);

    return {
      total: events.length,
      upcoming,
      past: events.length - upcoming,
      rsvps,
    };
  }, [events]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return events;

    return events.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.host?.name?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q),
    );
  }, [events, search]);

  const askDelete = (ev: TAdminEvent) => {
    setTarget(ev);
    onOpen();
  };

  const confirmDelete = () => {
    if (!target?._id) return;
    deleteEvent(target._id, {
      onSuccess: () => {
        onClose();
        setTarget(null);
      },
    });
  };

  const renderCell = React.useCallback((ev: any, columnKey: string) => {
    const isUpcoming = new Date(ev.date).getTime() >= Date.now();

    switch (columnKey) {
      case "title":
        return (
          <div className="max-w-[240px]">
            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
              {ev.title || "Untitled"}
            </p>
            {ev.location && (
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3" />
                {ev.location}
              </p>
            )}
          </div>
        );
      case "host":
        return (
          <User
            avatarProps={{ radius: "lg", src: ev.host?.profilePhoto }}
            name={ev.host?.name || "Unknown"}
          />
        );
      case "date":
        return (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatDate(ev.date)}
          </p>
        );
      case "rsvps":
        return (
          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 text-emerald-500" />
            {ev.attendees?.length || 0}
          </span>
        );
      case "status":
        return (
          <Chip
            color={isUpcoming ? "success" : "default"}
            size="sm"
            variant="flat"
          >
            {isUpcoming ? "Upcoming" : "Past"}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              as={Link}
              href={`/events/${ev._id}`}
              size="sm"
              variant="bordered"
            >
              View
            </Button>
            <Button
              color="danger"
              size="sm"
              startContent={<Trash2 className="w-4 h-4" />}
              variant="flat"
              onClick={() => askDelete(ev)}
            >
              Delete
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
      label: "Total Events",
      value: stats.total,
      icon: CalendarDays,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: CalendarClock,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Past",
      value: stats.past,
      icon: History,
      color: "text-gray-500",
      bg: "bg-gray-100 dark:bg-gray-700/40",
    },
    {
      label: "Total RSVPs",
      value: stats.rsvps,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageHeader
        action={
          <Button
            as={Link}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            href="/events/create"
            startContent={<Plus className="w-4 h-4" />}
          >
            Create Event
          </Button>
        }
        icon={CalendarDays}
        subtitle="Manage and moderate community events"
        title="Event Management"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            placeholder="Search events, hosts, locations"
            size="sm"
            startContent={<Search className="w-4 h-4 text-gray-400" />}
            value={search}
            variant="bordered"
            onValueChange={setSearch}
          />
        </div>

        <Table aria-label="Event management table" removeWrapper>
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
          <TableBody emptyContent="No events found." items={filtered}>
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

      {/* Delete confirmation */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete event?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This will permanently remove
                  <span className="font-semibold"> “{target?.title}”</span>{" "}
                  hosted by {target?.host?.name || "Unknown"}. This action
                  cannot be undone.
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
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
