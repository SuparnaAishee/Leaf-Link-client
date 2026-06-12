"use client";

import Link from "next/link";
import {
  Users,
  FileText,
  CreditCard,
  Settings,
  TrendingUp,
  Leaf,
  Shield,
  Activity,
  UserCheck,
  UserX,
  BarChart3,
  Loader2,
} from "lucide-react";

import { useAdminStats } from "@/src/hooks/meta";

type TActivity = {
  type: string;
  action: string;
  user: string;
  time: string;
};

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);

  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const AdminDashboard = () => {
  const { data, isLoading, isError } = useAdminStats();

  const stats = data?.data ?? {
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    premiumUsers: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
    recentActivity: [],
  };

  const pct = (part: number, total: number) =>
    total > 0 ? `${Math.round((part / total) * 100)}% of total` : undefined;

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: UserCheck,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      hint: pct(stats.activeUsers, stats.totalUsers),
    },
    {
      title: "Total Posts",
      value: stats.totalPosts.toLocaleString(),
      icon: FileText,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers.toLocaleString(),
      icon: Shield,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      hint: pct(stats.premiumUsers, stats.totalUsers),
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      title: "New This Month",
      value: stats.newUsersThisMonth.toLocaleString(),
      icon: TrendingUp,
      color: "from-teal-500 to-green-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
  ];

  const quickActions = [
    {
      title: "User Management",
      href: "/admin/user-management",
      icon: Users,
      description: "Manage user accounts and roles",
    },
    {
      title: "Payment History",
      href: "/admin/payment-history",
      icon: CreditCard,
      description: "View payment transactions",
    },
    {
      title: "Edit Profile",
      href: "/admin/profile-update",
      icon: BarChart3,
      description: "Update your admin profile",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <UserCheck className="w-4 h-4 text-green-500" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-amber-500" />;
      case "post":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "report":
        return <UserX className="w-4 h-4 text-red-500" />;
      case "verify":
        return <Shield className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const recentActivity: TActivity[] = stats.recentActivity ?? [];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
            {isLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-green-500" />
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here&apos;s a live overview of your gardening community
            platform.
          </p>
          {isError && (
            <p className="mt-2 text-sm text-red-500">
              Could not load live stats. Please try refreshing.
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className="w-6 h-6 text-green-600" />
                </div>
                {stat.hint && (
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    {stat.hint}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {isLoading ? (
                  <span className="inline-block h-7 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ) : (
                  stat.value
                )}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-green-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group"
                >
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                    <action.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-green-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {isLoading && (
                <p className="text-sm text-gray-400">Loading activity…</p>
              )}
              {!isLoading && recentActivity.length === 0 && (
                <p className="text-sm text-gray-400">No recent activity yet.</p>
              )}
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.user} • {timeAgo(activity.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Platform Health</h3>
              <p className="text-green-100">
                {isError
                  ? "API unreachable — check the server."
                  : "Database connected · API online · All systems operational."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  isError ? "bg-red-300" : "bg-green-300"
                }`}
              />
              <span className="font-medium">
                {isError ? "Degraded" : "Healthy"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
