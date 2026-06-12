"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavItems } from "./AdminSidebar";

const AdminMobileNav = () => {
  const pathname = usePathname();

  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 px-4 pt-3">
        <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-800 dark:text-white">
          Admin Panel
        </span>
      </div>
      <nav className="flex gap-2 px-3 py-3 overflow-x-auto">
        {adminNavItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <item.icon size={15} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminMobileNav;
