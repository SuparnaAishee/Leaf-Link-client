"use client";

import React, { ReactNode } from "react";

import AdminSidebar from "@/src/components/shared/AdminSidebar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <div className="lg:grid grid-cols-12 lg:border-t-1 border-gray-800 h-screen">
        <AdminSidebar />
        <main className="col-span-10">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
