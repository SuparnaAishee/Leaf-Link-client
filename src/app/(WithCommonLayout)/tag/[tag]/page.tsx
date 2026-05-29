"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Hash, Heart, MessageCircle, Leaf } from "lucide-react";

import envConfig from "@/src/config/envConfig";
import { TPost } from "@/src/types/post";
import { RichText } from "@/src/components/post/RichText";

const BLANK_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

export default function TagPage() {
  const params = useParams<{ tag: string }>();
  const tag = decodeURIComponent(params?.tag || "");
  const [posts, setPosts] = useState<TPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tag) return;
    setLoading(true);
    axios
      .get(`${envConfig.baseApi}/posts/by-tag/${encodeURIComponent(tag)}`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setPosts(res.data.data);
        } else {
          setPosts([]);
        }
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [tag]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to feed
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
            <Hash className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              #{tag}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading
                ? "Loading…"
                : `${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
            </p>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Hash className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No posts yet for #{tag}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Be the first — write a post and include{" "}
              <span className="text-green-600 font-medium">#{tag}</span> in it.
            </p>
            <Link href="/profile/create-post">
              <button className="mt-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                Create a post
              </button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => {
              const author = (post.user as any) || {};
              return (
                <li
                  key={post._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Link href="/profile" className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={author.profilePhoto || BLANK_AVATAR}
                        alt={author.name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href="/profile"
                        className="font-semibold text-sm text-gray-900 dark:text-white hover:text-green-600 transition-colors"
                      >
                        {author.name || "Anonymous gardener"}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {post.category}
                      </p>
                    </div>
                  </div>
                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden mb-3 aspect-video bg-gray-100 dark:bg-gray-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                      <RichText>{post.description}</RichText>
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {post.upvotes?.length || 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments?.length || 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-green-500" />
                      {post.category}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
