"use client";

import { useState, useEffect } from "react";
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
  Eye,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    premiumUsers: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "New user registered", user: "John Doe", time: "2 mins ago", type: "user" },
    { id: 2, action: "Premium subscription", user: "Jane Smith", time: "15 mins ago", type: "payment" },
    { id: 3, action: "New post created", user: "Alice Johnson", time: "1 hour ago", type: "post" },
    { id: 4, action: "User reported content", user: "Bob Wilson", time: "2 hours ago", type: "report" },
    { id: 5, action: "Profile verified", user: "Sarah Connor", time: "3 hours ago", type: "verify" },
  ]);

  useEffect(() => {
    setStats({
      totalUsers: 1247,
      activeUsers: 892,
      totalPosts: 3456,
      premiumUsers: 156,
      totalRevenue: 4580,
      newUsersThisMonth: 89,
    });
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      change: "+12%",
      positive: true,
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: UserCheck,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+8%",
      positive: true,
    },
    {
      title: "Total Posts",
      value: stats.totalPosts.toLocaleString(),
      icon: FileText,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: "+23%",
      positive: true,
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers.toLocaleString(),
      icon: Shield,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      change: "+5%",
      positive: true,
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      change: "+18%",
      positive: true,
    },
    {
      title: "New This Month",
      value: stats.newUsersThisMonth.toLocaleString(),
      icon: TrendingUp,
      color: "from-teal-500 to-green-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      change: "-3%",
      positive: false,
    },
  ];

  const quickActions = [
    { title: "User Management", href: "/admin/user-management", icon: Users, description: "Manage user accounts and roles" },
    { title: "Payment History", href: "/admin/payment-history", icon: CreditCard, description: "View payment transactions" },
    { title: "Edit Profile", href: "/admin/profile-update", icon: BarChart3, description: "Update your admin profile" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user": return <UserCheck className="w-4 h-4 text-green-500" />;
      case "payment": return <CreditCard className="w-4 h-4 text-amber-500" />;
      case "post": return <FileText className="w-4 h-4 text-blue-500" />;
      case "report": return <UserX className="w-4 h-4 text-red-500" />;
      case "verify": return <Shield className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
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
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here&apos;s an overview of your gardening community platform.
          </p>
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
                  <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text' }} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {stat.value}
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
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
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
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
              View All Activity
            </button>
          </div>
        </div>

        {/* Platform Health */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Platform Health</h3>
              <p className="text-green-100">All systems operational. Server uptime: 99.9%</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" />
              <span className="font-medium">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
