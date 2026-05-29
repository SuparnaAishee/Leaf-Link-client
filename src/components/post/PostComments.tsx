"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CornerDownRight, Send, X } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/src/context/user.provider";
import { useAddComment, useGetCommentsByPost } from "@/src/hooks/comment";
import { IComment } from "@/src/types/comment";
import { RichText } from "./RichText";

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

interface ReplyTarget {
  id: string;
  name: string;
}

export default function PostComments({
  postId,
  onCommentAdded,
}: PostCommentsProps) {
  const router = useRouter();
  const { user } = useUser();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<
    Record<string, boolean>
  >({});

  const { data, isLoading, refetch } = useGetCommentsByPost(postId);
  const allComments: IComment[] = data?.data || [];

  const { topLevel, repliesByParent } = useMemo(() => {
    const tops: IComment[] = [];
    const map: Record<string, IComment[]> = {};
    for (const c of allComments) {
      const parent = c.parentComment ? String(c.parentComment) : null;
      if (parent) {
        if (!map[parent]) map[parent] = [];
        map[parent].push(c);
      } else {
        tops.push(c);
      }
    }
    return { topLevel: tops, repliesByParent: map };
  }, [allComments]);

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
      {
        comment: trimmed,
        post: postId,
        user: user._id,
        parentComment: replyTo?.id ?? null,
      },
      {
        onSuccess: () => {
          setText("");
          if (replyTo) {
            setExpandedThreads((prev) => ({ ...prev, [replyTo.id]: true }));
            setReplyTo(null);
          }
          refetch();
          onCommentAdded?.();
        },
      },
    );
  };

  const startReply = (target: IComment) => {
    if (!user?._id) {
      toast.error("Please log in to reply");
      router.push("/login");
      return;
    }
    const name = target.user?.name || "user";
    setReplyTo({ id: target._id, name });
    setText("");
  };

  const placeholder = replyTo
    ? `Reply to @${replyTo.name}…`
    : "Add a comment...";

  return (
    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
      <div className="pt-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : topLevel.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
            No comments yet. Be the first!
          </p>
        ) : (
          <div className="space-y-3 mb-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-hide">
            {topLevel.map((c) => {
              const replies = repliesByParent[c._id] || [];
              const showReplies = expandedThreads[c._id] ?? false;
              return (
                <CommentRow
                  key={c._id}
                  comment={c}
                  onReply={() => startReply(c)}
                >
                  {replies.length > 0 && (
                    <div className="mt-2 ml-2 pl-3 border-l-2 border-gray-100 dark:border-gray-700 space-y-2">
                      {!showReplies ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedThreads((prev) => ({
                              ...prev,
                              [c._id]: true,
                            }))
                          }
                          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          View {replies.length}{" "}
                          {replies.length === 1 ? "reply" : "replies"}
                        </button>
                      ) : (
                        <>
                          {replies.map((r) => (
                            <CommentRow
                              key={r._id}
                              comment={r}
                              onReply={() => startReply(c)}
                              compact
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedThreads((prev) => ({
                                ...prev,
                                [c._id]: false,
                              }))
                            }
                            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors"
                          >
                            Hide replies
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </CommentRow>
              );
            })}
          </div>
        )}

        {replyTo && (
          <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs px-3 py-1.5 rounded-full mb-2">
            <span>
              Replying to <span className="font-semibold">@{replyTo.name}</span>
            </span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="hover:opacity-70"
              aria-label="Cancel reply"
            >
              <X className="w-3.5 h-3.5" />
            </button>
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
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isPending}
            className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!text.trim() || isPending}
            className="text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 disabled:text-green-300 dark:disabled:text-green-800 disabled:cursor-not-allowed flex items-center gap-1"
            aria-label={replyTo ? "Post reply" : "Post comment"}
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                {replyTo ? "Reply" : "Post"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function CommentRow({
  comment,
  onReply,
  compact,
  children,
}: {
  comment: IComment;
  onReply: () => void;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  const author = comment.user;
  const name = author?.name || "Anonymous";
  const photo = author?.profilePhoto || BLANK_AVATAR;
  const avatarSize = compact ? "w-7 h-7" : "w-8 h-8";

  return (
    <div className="flex gap-2.5">
      <Link href="/profile" className="flex-shrink-0">
        <img
          src={photo}
          alt={name}
          className={`${avatarSize} rounded-full object-cover`}
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
            <RichText>{comment.comment}</RichText>
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1 ml-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timeAgo(comment.createdAt)}
          </span>
          <button
            type="button"
            onClick={onReply}
            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors"
          >
            Reply
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
