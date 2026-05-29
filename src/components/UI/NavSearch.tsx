"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Search,
  X,
  UserPlus,
  UserCheck,
  Verified,
  Loader2,
  FileText,
  Leaf,
} from "lucide-react";
import { toast } from "sonner";

import envConfig from "@/src/config/envConfig";
import { useUser } from "@/src/context/user.provider";
import { useFollowUnfollow } from "@/src/hooks/follow";
import { TUser } from "@/src/types";
import { TPost } from "@/src/types/post";

const BLANK_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

interface Props {
  placeholder?: string;
  variant?: "navbar" | "menu";
}

const NavSearch: React.FC<Props> = ({
  placeholder = "Search gardeners…",
  variant = "navbar",
}) => {
  const { user } = useUser();
  const { mutate: toggleFollow } = useFollowUnfollow();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<TUser[]>([]);
  const [postResults, setPostResults] = useState<TPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [followOverrides, setFollowOverrides] = useState<
    Record<string, boolean>
  >({});

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setPostResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const isTagQuery = trimmed.startsWith("#");
        const tagOnly = isTagQuery ? trimmed.slice(1) : trimmed;
        const [usersRes, postsRes] = await Promise.all([
          isTagQuery
            ? Promise.resolve({ data: { success: true, data: { users: [] } } })
            : axios.get(`${envConfig.baseApi}/users`, {
                params: { searchTerm: trimmed, page: 1, limit: 5 },
              }),
          axios.get(`${envConfig.baseApi}/posts`, {
            params: { searchTerm: tagOnly, page: 1, limit: 5 },
          }),
        ]);

        const users =
          usersRes?.data?.success && Array.isArray(usersRes.data?.data?.users)
            ? usersRes.data.data.users
            : [];
        const posts =
          postsRes?.data?.success && Array.isArray(postsRes.data?.data)
            ? postsRes.data.data
            : [];

        setResults(users);
        setPostResults(posts);
      } catch {
        setResults([]);
        setPostResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isFollowing = (target: TUser) => {
    if (target._id in followOverrides) return followOverrides[target._id];
    const own = (user?.following || []) as any[];
    return (
      (target.isFollowing as unknown as boolean) ||
      own.some(
        (entry) =>
          (typeof entry === "string" ? entry : entry?._id) === target._id
      )
    );
  };

  const handleToggleFollow = (target: TUser) => {
    if (!user?._id) {
      toast.error("Please log in to follow people");
      return;
    }
    if (target._id === user._id) return;

    const wasFollowing = isFollowing(target);
    setFollowOverrides((p) => ({ ...p, [target._id]: !wasFollowing }));

    toggleFollow(
      { followingId: target._id },
      {
        onError: () => {
          setFollowOverrides((p) => ({
            ...p,
            [target._id]: wasFollowing,
          }));
        },
      }
    );
  };

  const inputClass =
    variant === "navbar"
      ? "py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full focus:bg-white dark:focus:bg-gray-700"
      : "py-3 bg-gray-100 dark:bg-gray-800 rounded-xl";

  return (
    <div ref={containerRef} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className={`w-full pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-500 ${inputClass}`}
        aria-label="Search gardeners"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setResults([]);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>
      )}

      {open && (query.trim().length > 0 || loading) && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[28rem] overflow-y-auto">
          {loading ? (
            <div className="px-4 py-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching…
            </div>
          ) : results.length === 0 && postResults.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-2">
                <Search className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                No matches
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try a different name or post keyword.
              </p>
            </div>
          ) : (
            <ul className="py-2">
              {results.length > 0 && (
                <li className="px-4 pb-1 pt-1 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                  Gardeners
                </li>
              )}
              {results.map((u) => {
                const isMe = u._id === user?._id;
                const following = isFollowing(u);
                return (
                  <li
                    key={u._id}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="relative shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u.profilePhoto || BLANK_AVATAR}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {u.isVerified && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                          <Verified className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex-1 min-w-0"
                    >
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {(u as any).bio || "Sharing tips on LeafLink"}
                      </p>
                    </Link>
                    {!isMe && user?._id && (
                      <button
                        type="button"
                        onClick={() => handleToggleFollow(u)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                          following
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm"
                        }`}
                      >
                        {following ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            Follow
                          </>
                        )}
                      </button>
                    )}
                  </li>
                );
              })}

              {postResults.length > 0 && (
                <li className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-t border-gray-100 dark:border-gray-700 mt-1">
                  Posts
                </li>
              )}
              {postResults.map((post) => {
                const tag = (post.description || "").match(/#([a-zA-Z0-9_]+)/)?.[1];
                const href = tag
                  ? `/tag/${encodeURIComponent(tag.toLowerCase())}`
                  : "/";
                return (
                  <li
                    key={post._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-2.5"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center overflow-hidden">
                        {post.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-green-500" />
                          {post.category}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NavSearch;
