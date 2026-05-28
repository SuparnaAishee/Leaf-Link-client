"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/src/context/user.provider";
import { useAddComment, useGetCommentsByPost } from "@/src/hooks/comment";
import { IComment } from "@/src/types/comment";

const BLANK_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

function timeAgo(date?: string) {
  if (!date) return "";
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString();
}

interface PostCommentsProps {
  postId: string;
  onCommentAdded?: () => void;
}

export default function PostComments({
  postId,
  onCommentAdded,
}: PostCommentsProps) {
  const router = useRouter();
  const { user } = useUser();
  const [text, setText] = useState("");

  const { data, isLoading, refetch } = useGetCommentsByPost(postId);
  const comments: IComment[] = data?.data || [];

  const { mutate: addComment, isPending } = useAddComment();

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!user?._id) {
      toast.error("Please log in to comment");
      router.push("/login");
      return;
    }

    addComment(
      { comment: trimmed, post: postId, user: user._id },
      {
        onSuccess: () => {
          setText("");
          refetch();
          onCommentAdded?.();
        },
      },
    );
  };

  return (
    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
      <div className="pt-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
            No comments yet. Be the first!
          </p>
        ) : (
          <div className="space-y-3 mb-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
            {comments.map((c) => {
              const author = c.user;
              const name = author?.name || "Anonymous";
              const photo = author?.profilePhoto || BLANK_AVATAR;
              return (
                <div key={c._id} className="flex gap-2.5">
                  <Link href="/profile" className="flex-shrink-0">
                    <img
                      src={photo}
                      alt={name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl px-3 py-2">
                      <Link
                        href="/profile"
                        className="text-sm font-semibold text-gray-900 dark:text-white hover:text-green-600 transition-colors"
                      >
                        {name}
                      </Link>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                        {c.comment}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {timeAgo((c as any).createdAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setText(`@${name} `)}
                        className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700"
        >
          <img
            src={user?.profilePhoto || BLANK_AVATAR}
            alt="You"
            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isPending}
            className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!text.trim() || isPending}
            className="text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 disabled:text-green-300 dark:disabled:text-green-800 disabled:cursor-not-allowed flex items-center gap-1"
            aria-label="Post comment"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
