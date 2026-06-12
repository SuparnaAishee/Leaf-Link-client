"use client";

import dynamic from "next/dynamic";
import { UserCog } from "lucide-react";

import AdminPageHeader from "@/src/components/shared/AdminPageHeader";

const ProfileUpdate = dynamic(
  () => import("@/src/components/UI/ProfileUpdate/ProfileUpdate"),
  {
    ssr: false,
  },
);

const UpdateProfile = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageHeader
        icon={UserCog}
        title="Profile Update"
        subtitle="Update your admin account details"
      />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <ProfileUpdate />
      </div>
    </div>
  );
};

export default UpdateProfile;
