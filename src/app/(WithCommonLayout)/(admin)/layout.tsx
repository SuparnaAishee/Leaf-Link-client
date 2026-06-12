"use client";

import React, { ReactNode } from "react";

import AdminSidebar from "@/src/components/shared/AdminSidebar";
import AdminMobileNav from "@/src/components/shared/AdminMobileNav";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    // Fill exactly the viewport below the shared fixed navbar (h-16 / 4rem).
    // lg:overflow-hidden keeps the page from scrolling — only <main> scrolls,
    // so there's a single scrollbar instead of two.
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
      <AdminMobileNav />
      <div className="lg:grid lg:grid-cols-12 lg:h-full">
        <AdminSidebar />
        <main className="col-span-10 lg:h-full lg:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
