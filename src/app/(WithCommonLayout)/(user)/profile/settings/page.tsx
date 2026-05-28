"use client";

import { useRouter } from "next/navigation";
import {
  Settings as SettingsIcon,
  Edit3,
  ShieldCheck,
  Lock,
  UserCircle,
  ClipboardCheck,
  Heart,
  ChevronRight,
} from "lucide-react";

type Row = {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  tone: string;
  onClick: () => void;
};

const SettingsPage = () => {
  const router = useRouter();

  const rows: Row[] = [
    {
      key: "edit",
      label: "Edit Profile",
      description: "Update your name, bio, and photo",
      icon: <Edit3 className="w-5 h-5" />,
      tone: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300",
      onClick: () => router.push("/profile/updateProfile"),
    },
    {
      key: "verify",
      label: "Verify Profile",
      description: "Get the blue checkmark next to your name",
      icon: <ShieldCheck className="w-5 h-5" />,
      tone: "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-300",
      onClick: () => router.push("/profile/verify-profile"),
    },
    {
      key: "password",
      label: "Change Password",
      description: "Coming soon — manage from your account",
      icon: <Lock className="w-5 h-5" />,
      tone: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300",
      onClick: () => router.push("/profile/updateProfile"),
    },
    {
      key: "details",
      label: "Profile Details",
      description: "View your public profile",
      icon: <UserCircle className="w-5 h-5" />,
      tone: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300",
      onClick: () => router.push("/profile"),
    },
    {
      key: "premium",
      label: "Account Status",
      description: "See your premium status and history",
      icon: <ClipboardCheck className="w-5 h-5" />,
      tone: "text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300",
      onClick: () => router.push("/profile/premiumContent"),
    },
    {
      key: "favs",
      label: "Favourites",
      description: "Posts you've bookmarked",
      icon: <Heart className="w-5 h-5" />,
      tone: "text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-300",
      onClick: () => router.push("/profile"),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-100px)] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md shadow-green-500/30">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden">
          {rows.map((row, i) => (
            <button
              key={row.key}
              onClick={row.onClick}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-green-50/60 dark:hover:bg-green-900/20 transition-colors ${
                i !== rows.length - 1
                  ? "border-b border-gray-100 dark:border-gray-700/60"
                  : ""
              }`}
            >
              <span className={`flex-shrink-0 p-2.5 rounded-xl ${row.tone}`}>
                {row.icon}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-gray-900 dark:text-white">
                  {row.label}
                </span>
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {row.description}
                </span>
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
