"use client";

import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
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

import { EditIcon } from "@/src/components/UI/icons";
import { useGetAllUsers, useUpdateUser } from "@/src/hooks/user";
import Loading from "@/src/components/shared/Loading";
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

  const handleUpdateUser = (type: TUpdateType, payload: IUser) => {
    let updateData;

    if (type === "ACTIVE" || type === "BLOCKED") {
      updateData = {
        id: payload._id,
        data: {
          status: type,
        },
      };
    } else {
      updateData = {
        id: payload._id,
        data: {
          role: type,
        },
      };
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
          <div className="flex flex-col">
            <p className={`text-bold text-sm capitalize`}>{user.role}</p>
          </div>
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
                <Button variant="bordered">
                  Edit User
                  <Tooltip content="Edit user">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <EditIcon />
                    </span>
                  </Tooltip>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {user?.role === "USER" ? (
                  <DropdownItem
                    key="user-to-admin"
                    color="success"
                    onClick={() => handleUpdateUser("ADMIN", user)}
                  >
                    Make Admin
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key="user-to-admin"
                    color="success"
                    onClick={() => handleUpdateUser("USER", user)}
                  >
                    Make User{" "}
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

  if (isLoading) {
    return <Loading />;
  }

  // Check if data exists and is an array
  const users = data?.data || [];

  if (users.length === 0) {
    return <div>No users available</div>;
  }

  return (
    <>
      <div className="p-5">
        <Table aria-label="Example table with custom cells">
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
          <TableBody items={users}>
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
    </>
  );
}
