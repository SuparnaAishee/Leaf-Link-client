"use client";

import {
  ChangeEvent,
  FormEvent,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Search, UserCheck, UserPlus, Verified, X } from "lucide-react";
import { toast } from "sonner";

import envConfig from "@/src/config/envConfig";
import { useUser } from "@/src/context/user.provider";
import { useFollowUnfollow } from "@/src/hooks/follow";
import { TUser } from "@/src/types";

const BLANK_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

function SearchUserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const { user } = useUser();
  const { mutate: toggleFollow } = useFollowUnfollow();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followOverrides, setFollowOverrides] = useState<
    Record<string, boolean>
  >({});

  const runSearch = useCallback(async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${envConfig.baseApi}/users`, {
        params: { searchTerm: trimmed, page: 1, limit: 20 },
      });
      if (data?.success && Array.isArray(data?.data?.users)) {
        setResults(data.data.users);
      } else {
        setResults([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't run that search");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run any query coming in via the URL on mount / change.
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      runSearch(initialQuery);
    }
  }, [initialQuery, runSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.replace(`/profile/searchUser?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.replace(`/profile/searchUser`);
    }
    runSearch(trimmed);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError(null);
    router.replace(`/profile/searchUser`);
  };

  const isFollowing = (target: TUser) => {
    if (target._id in followOverrides) return followOverrides[target._id];
    const own = (user?.following || []) as any[];
    return (
      target.isFollowing as unknown as boolean ||
      own.some((entry) =>
        (typeof entry === "string" ? entry : entry?._id) === target._id,
      )
    );
  };

  const handleToggleFollow = (target: TUser) => {
    if (!user?._id) {
      toast.error("Please log in to follow people");
      router.push("/login");
      return;
    }
    if (target._id === user._id) return;

    const wasFollowing = isFollowing(target);
    setFollowOverrides((prev) => ({ ...prev, [target._id]: !wasFollowing }));

    toggleFollow(
      { followingId: target._id },
      {
        onError: () => {
          setFollowOverrides((prev) => ({
            ...prev,
            [target._id]: wasFollowing,
          }));
        },
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h1 className="font-bold text-gray-900 dark:text-white text-lg">
              Find gardeners
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Search by name to follow people who grow what you grow.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
                placeholder="Search gardeners by name…"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-700"
                aria-label="Search gardeners"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}
            </div>
          </form>

          <div className="px-5 pb-5">
            {error && (
              <p className="text-sm text-red-500 py-2">{error}</p>
            )}

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="h-2.5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    </div>
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {query ? "No gardeners match that search" : "Start typing to discover people"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {query
                    ? "Try a different name or check the spelling."
                    : "Search by first name, last name, or username."}
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {results.map((u) => {
                  const isMe = u._id === user?._id;
                  const following = isFollowing(u);
                  return (
                    <li
                      key={u._id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-xl transition-colors"
                    >
                      <Link href="/profile" className="relative">
                        <img
                          src={u.profilePhoto || BLANK_AVATAR}
                          alt={u.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {u.isVerified && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                            <Verified className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href="/profile"
                          className="block font-semibold text-sm text-gray-900 dark:text-white hover:text-green-600 transition-colors truncate"
                        >
                          {u.name}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {u.bio || "Sharing tips on LeafLink"}
                        </p>
                      </div>
                      {!isMe && (
                        <button
                          type="button"
                          onClick={() => handleToggleFollow(u)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            following
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm hover:shadow"
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
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchUserPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchUserContent />
    </Suspense>
  );
}
