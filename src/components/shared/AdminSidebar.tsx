"use client";
import {
  GalleryThumbnails,
  HistoryIcon,
  LayoutDashboard,
  User,
  User2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block  col-span-2  border-r-1 border-gray-800 pt-5">
      <Link
        className={`flex items-center gap-3 hover-nav-item px-3 py-2 ${pathname === "/admin" ? "bg-[#a8b3cf33]" : ""}`}
        href="/admin"
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </Link>
      <Link
        className={`flex items-center gap-3 hover-nav-item px-3 py-2 ${pathname === "/admin/user-management" ? "bg-[#a8b3cf33]" : ""}`}
        href="/admin/user-management"
      >
        <User size={18} />
        <span>User Management</span>
      </Link>
      <Link
        className={`flex items-center gap-3 hover-nav-item px-3 py-2 ${pathname === "/admin/post-management" ? "bg-[#a8b3cf33]" : ""}`}
        href="/admin/post-management"
      >
        <GalleryThumbnails size={18} />
        <span>Post Management</span>
      </Link>
      <Link
        className={`flex items-center gap-3 hover-nav-item px-3 py-2 ${pathname === "/admin/payment-history" ? "bg-[#a8b3cf33]" : ""}`}
        href="/admin/payment-history"
      >
        <HistoryIcon size={18} />
        <span>Payment History</span>
      </Link>
      <Link
        className={`flex items-center gap-3 hover-nav-item px-3 py-2 ${pathname === "/admin/payment-management" ? "bg-[#a8b3cf33]" : ""}`}
        href="/admin/payment-management"
      >
        <HistoryIcon size={18} />
        <span>Payment Management</span>
      </Link>
      <Link
        className={`flex items-center gap-3 hover-nav-item px-3 py-2 ${pathname === "/admin/profile-update" ? "bg-[#a8b3cf33]" : ""}`}
        href="/admin/profile-update"
      >
        <User2 size={18} />
        <span>Profile Update</span>
      </Link>
    </div>
  );
};

export default AdminSidebar;
