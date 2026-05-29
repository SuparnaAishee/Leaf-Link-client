"use client";

import Link from "next/link";
import {
  Bell,
  AtSign,
  Check,
  Crown,
  Heart,
  MessageCircle,
  Reply,
  UserPlus,
} from "lucide-react";

import { useUser } from "@/src/context/user.provider";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from "@/src/hooks/notification";

const BLANK_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

type N = {
  _id: string;
  type: "follow" | "comment" | "reply" | "upvote" | "mention" | "premium";
  actor?: { _id: string; name: string; profilePhoto?: string };
  post?: { _id: string; title: string };
  comment?: { _id: string; comment: string };
  message?: string;
  read: boolean;
  createdAt: string;
};

const iconFor = (type: N["type"]) => {
  switch (type) {
    case "follow":
      return <UserPlus className="w-4 h-4 text-blue-500" />;
    case "comment":
      return <MessageCircle className="w-4 h-4 text-emerald-500" />;
    case "reply":
      return <Reply className="w-4 h-4 text-emerald-500" />;
    case "upvote":
      return <Heart className="w-4 h-4 text-rose-500" />;
    case "mention":
      return <AtSign className="w-4 h-4 text-purple-500" />;
    case "premium":
      return <Crown className="w-4 h-4 text-amber-500" />;
  }
};

const sentenceFor = (n: N) => {
  const actor = n.actor?.name || "Someone";
  switch (n.type) {
    case "follow":
      return `${actor} started following you`;
    case "comment":
      return `${actor} commented on your post`;
    case "reply":
      return `${actor} replied to your comment`;
    case "upvote":
      return `${actor} liked your post`;
    case "mention":
      return `${actor} mentioned you`;
    case "premium":
      return n.message || "Premium activated";
  }
};

const timeAgo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function NotificationsPage() {
  const { user } = useUser();
  const enabled = !!user?.email;

  const { data: listResponse, isLoading } = useNotifications(enabled);
  const { data: unreadResponse } = useUnreadCount(enabled);
  const { mutate: markOneRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const items: N[] = (listResponse as any)?.data || [];
  const unread = (unreadResponse as any)?.data?.count ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {unread > 0
                  ? `You have ${unread} unread`
                  : "You're all caught up"}
              </p>
            </div>
          </div>
          <button
            onClick={() => markAllRead()}
            disabled={unread === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Bell className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Nothing here yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              When someone follows you, comments on your posts, or likes
              your work, you&apos;ll see it here.
            </p>
            <Link href="/">
              <button className="mt-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                Back to feed
              </button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((n) => (
              <li
                key={n._id}
                onClick={() => {
                  if (!n.read) markOneRead(n._id);
                }}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  n.read
                    ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    : "bg-green-50/80 dark:bg-green-900/15 border-green-200 dark:border-green-800/60 hover:bg-green-50 dark:hover:bg-green-900/25"
                }`}
              >
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={n.actor?.profilePhoto || BLANK_AVATAR}
                    alt={n.actor?.name || "User"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow border border-gray-100 dark:border-gray-700">
                    {iconFor(n.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white leading-snug">
                    {sentenceFor(n)}
                  </p>
                  {n.post?.title && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                      “{n.post.title}”
                    </p>
                  )}
                  {n.comment?.comment && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1 italic">
                      “{n.comment.comment}”
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 mt-2 shrink-0" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
