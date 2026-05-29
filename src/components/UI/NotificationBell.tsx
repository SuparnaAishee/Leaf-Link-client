"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Crown,
  Reply,
  Check,
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
  type: "follow" | "comment" | "reply" | "upvote" | "premium";
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
      return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
    case "comment":
      return <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />;
    case "reply":
      return <Reply className="w-3.5 h-3.5 text-emerald-500" />;
    case "upvote":
      return <Heart className="w-3.5 h-3.5 text-rose-500" />;
    case "premium":
      return <Crown className="w-3.5 h-3.5 text-amber-500" />;
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
    case "premium":
      return n.message || "Premium activated";
  }
};

const timeAgo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const NotificationBell = () => {
  const { user } = useUser();
  const enabled = !!user?.email;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: unreadResponse } = useUnreadCount(enabled);
  const { data: listResponse } = useNotifications(enabled && open);
  const { mutate: markOneRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const unreadCount = (unreadResponse as any)?.data?.count ?? 0;
  const items: N[] = ((listResponse as any)?.data || []).slice(0, 6);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!enabled) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="nav-icon relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              Notifications
            </p>
            <button
              onClick={() => markAllRead()}
              disabled={unreadCount === 0}
              className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Mark all read
            </button>
          </div>

          {items.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-2">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                You&apos;re all caught up
              </p>
              <p className="text-xs text-gray-500 mt-1">
                New follows, comments, and likes will land here.
              </p>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((n) => (
                <li
                  key={n._id}
                  className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative ${
                    !n.read ? "bg-green-50/50 dark:bg-green-900/10" : ""
                  }`}
                  onClick={() => {
                    if (!n.read) markOneRead(n._id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={n.actor?.profilePhoto || BLANK_AVATAR}
                        alt={n.actor?.name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                        {iconFor(n.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white leading-snug">
                        {sentenceFor(n)}
                      </p>
                      {n.post?.title && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          “{n.post.title}”
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 py-3 border-t border-gray-100 dark:border-gray-700"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
