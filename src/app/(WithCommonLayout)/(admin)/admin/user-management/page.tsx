"use client";

import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import {
  ChevronDown,
  Search,
  Shield,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import { useGetAllUsers, useUpdateUser } from "@/src/hooks/user";
import Loading from "@/src/components/shared/Loading";
import AdminPageHeader from "@/src/components/shared/AdminPageHeader";
import { IUser, TUpdateType } from "@/src/types";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export default function UserManagement() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAllUsers();
  const { mutate: updateUser } = useUpdateUser();
  const [search, setSearch] = useState("");

  const handleUpdateUser = (type: TUpdateType, payload: IUser) => {
    let updateData;

    if (type === "ACTIVE" || type === "BLOCKED") {
      updateData = { id: payload._id, data: { status: type } };
    } else {
      updateData = { id: payload._id, data: { role: type } };
    }

    updateUser(updateData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["all-users"] });
      },
    });
  };

  const renderCell = React.useCallback((user: any, columnKey: string) => {
    const cellValue = user[columnKey as keyof IUser];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.profilePhoto }}
            description={user.email}
            name={user.name}
          />
        );
      case "role":
        return (
          <Chip
            className="capitalize"
            color={user?.role === "ADMIN" ? "secondary" : "default"}
            size="sm"
            variant="flat"
          >
            {user.role}
          </Chip>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={user?.status === "ACTIVE" ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {user.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  size="sm"
                  variant="bordered"
                  endContent={<ChevronDown size={14} />}
                >
                  Manage
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User actions">
                {user?.role === "USER" ? (
                  <DropdownItem
                    key="make-admin"
                    color="success"
                    onClick={() => handleUpdateUser("ADMIN", user)}
                  >
                    Make Admin
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key="make-user"
                    color="success"
                    onClick={() => handleUpdateUser("USER", user)}
                  >
                    Make User
                  </DropdownItem>
                )}

                {user?.status === "ACTIVE" ? (
                  <DropdownItem
                    key="block"
                    className="text-danger"
                    color="danger"
                    onClick={() => handleUpdateUser("BLOCKED", user)}
                  >
                    Block User
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key="unblock"
                    color="success"
                    onClick={() => handleUpdateUser("ACTIVE", user)}
                  >
                    Unblock User
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const users: IUser[] = data?.data?.users || [];

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "ACTIVE").length,
      blocked: users.filter((u) => u.status === "BLOCKED").length,
      admins: users.filter((u) => u.role === "ADMIN").length,
    }),
    [users],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return users;

    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q),
    );
  }, [users, search]);

  if (isLoading) {
    return <Loading />;
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.total,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Active",
      value: stats.active,
      icon: UserCheck,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Blocked",
      value: stats.blocked,
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Admins",
      value: stats.admins,
      icon: Shield,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageHeader
        icon={Users}
        title="User Management"
        subtitle="Manage roles, access and account status"
      />

      {/* Summary stats */}
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

      {/* Table card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
        <div className="mb-4 max-w-xs">
          <Input
            placeholder="Search by name or email"
            size="sm"
            startContent={<Search className="w-4 h-4 text-gray-400" />}
            value={search}
            variant="bordered"
            onValueChange={setSearch}
          />
        </div>

        <Table aria-label="User management table" removeWrapper>
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
          <TableBody emptyContent="No users found." items={filtered}>
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
    </div>
  );
}
