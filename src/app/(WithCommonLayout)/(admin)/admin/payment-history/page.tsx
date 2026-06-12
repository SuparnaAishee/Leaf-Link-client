"use client";

import React, { useMemo } from "react";
import { Chip } from "@nextui-org/chip";
import { User } from "@nextui-org/user";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { CheckCircle2, CreditCard, DollarSign, Receipt } from "lucide-react";

import { useGetPaymentHistory } from "@/src/hooks/payment";
import Loading from "@/src/components/shared/Loading";
import AdminPageHeader from "@/src/components/shared/AdminPageHeader";
import { IPaymentHistory } from "@/src/types/payment";

const columns = [
  { name: "USER", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "DATE", uid: "date" },
  { name: "STATUS", uid: "status" },
  { name: "AMOUNT", uid: "amount" },
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

export default function PaymentHistory() {
  const { data: paymentHistory, isLoading } = useGetPaymentHistory();

  const payments: IPaymentHistory[] = paymentHistory?.data || [];

  const summary = useMemo(() => {
    const paid = payments.filter((p) => p.isPaid);
    const revenue = paid.reduce((sum, p) => sum + (p.amount || 0), 0);

    return { revenue, paidCount: paid.length, total: payments.length };
  }, [payments]);

  const renderCell = React.useCallback((payHistory: any, columnKey: string) => {
    const cellValue = payHistory[columnKey as keyof IPaymentHistory];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: payHistory?.user?.profilePhoto }}
            description={payHistory?.user?.email}
            name={payHistory?.user?.name}
          />
        );
      case "role":
        return (
          <p className="text-sm capitalize text-gray-600 dark:text-gray-300">
            {payHistory?.user?.role}
          </p>
        );
      case "date":
        return (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatDate(payHistory?.date)}
          </p>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={payHistory?.isPaid ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {payHistory.isPaid ? "Paid" : "Unpaid"}
          </Chip>
        );
      case "amount":
        return (
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            ${payHistory?.amount?.toLocaleString?.() ?? payHistory?.amount}
          </p>
        );
      default:
        return cellValue;
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${summary.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Paid Transactions",
      value: summary.paidCount,
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Total Records",
      value: summary.total,
      icon: Receipt,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageHeader
        icon={CreditCard}
        title="Payment History"
        subtitle="Premium membership transactions"
      />

      {/* Summary */}
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

      {/* Table card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
        <Table aria-label="Payment history table" removeWrapper>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "amount" ? "end" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent="No payment history available."
            items={payments}
          >
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
