"use client";

import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  ThumbsUp,
  Leaf,
  Clock,
  BookmarkCheck,
  Verified,
  MoreVertical,
  Link as LinkIcon,
  Flag,
  UserMinus,
  Copy,
} from "lucide-react";
import { TPost } from "@/src/types/post";
import envConfig from "@/src/config/envConfig";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/src/context/user.provider";
import { useAddVote } from "@/src/hooks/post";

const extractId = (entry: unknown): string | null => {
  if (!entry) return null;
  if (typeof entry === "string") return entry;
  if (typeof entry === "object" && entry !== null && "_id" in entry) {
    const id = (entry as { _id: unknown })._id;
    return typeof id === "string" ? id : null;
  }
  return null;
};

const upvotesIncludeUser = (
  upvotes: TPost["upvotes"] | undefined,
  userId: string | undefined,
) => {
  if (!upvotes || !userId) return false;
  return upvotes.some((entry) => extractId(entry) === userId);
};

export default function InfiniteScrollPosts({
  selectedCategory,
}: {
  selectedCategory: string;
}) {
  const router = useRouter();
  const { user } = useUser();
  const { mutate: castVote } = useAddVote();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [showComments, setShowComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showHeartAnimation, setShowHeartAnimation] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const lastTapRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
  }, [selectedCategory]);

  useEffect(() => {
    fetchPosts();
  }, [page, selectedCategory]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${envConfig.baseApi}/posts?page=${page}&category=${selectedCategory}`
      );

      if (!res.ok) {
        console.error("Failed to fetch posts");
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const response = await res.json();
      const newPosts: TPost[] = response.data || [];

      const filteredPosts = newPosts.filter((post) => post.isPremium === false);

      if (filteredPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) =>
          page === 1 ? filteredPosts : [...prevPosts, ...filteredPosts]
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
      setIsLoading(false);
    }
  };

  const toggleExpand = (postId: string) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleLike = (postId: string, showAnimation = false) => {
    if (!user?._id) {
      toast.error("Please log in to like posts");
      router.push("/login");
      return;
    }

    const userId = user._id;
    const target = posts.find((p) => p._id === postId);
    const wasLiked = upvotesIncludeUser(target?.upvotes, userId);

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id !== postId) return post;
        const upvotes = (post.upvotes || []) as TPost["upvotes"];
        const nextUpvotes = wasLiked
          ? upvotes.filter((entry) => extractId(entry) !== userId)
          : ([...upvotes, userId] as TPost["upvotes"]);
        return { ...post, upvotes: nextUpvotes };
      }),
    );

    if (showAnimation && !wasLiked) {
      setShowHeartAnimation(postId);
      setTimeout(() => setShowHeartAnimation(null), 1000);
    }

    castVote(
      { voteType: "upvote", userId, postId },
      {
        onError: () => {
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              if (post._id !== postId) return post;
              const upvotes = (post.upvotes || []) as TPost["upvotes"];
              const reverted = wasLiked
                ? ([...upvotes, userId] as TPost["upvotes"])
                : upvotes.filter((entry) => extractId(entry) !== userId);
              return { ...post, upvotes: reverted };
            }),
          );
        },
      },
    );
  };

  const handleDoubleTap = (postId: string) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[postId] || 0;

    if (now - lastTap < 300) {
      const target = posts.find((p) => p._id === postId);
      if (!upvotesIncludeUser(target?.upvotes, user?._id)) {
        toggleLike(postId, true);
      }
    }
    lastTapRef.current[postId] = now;
  };

  const handleCopyLink = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
    setOpenMenu(null);
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleShare = (post: TPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href + `/posts/${post._id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.href + `/posts/${post._id}`
      );
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Herbs: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Vegetables: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      Flowers: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
      Organic: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
      Indoor: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      Outdoor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  };

  // Show loading state on initial load
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
      </div>
    );
  }

  // Show empty state when no posts exist
  if (posts.length === 0 && !hasMore && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <Leaf className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          No posts yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Be the first to share your gardening tips!
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={posts.length}
      endMessage={
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800">
            <Leaf className="w-5 h-5" />
            <span className="font-medium">You&apos;re all caught up!</span>
          </div>
        </div>
      }
      hasMore={hasMore}
      loader={
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-500 dark:text-gray-400">Loading more posts...</span>
          </div>
        </div>
      }
      next={() => setPage(page + 1)}
      className="space-y-4"
    >
      {posts.map((post, index) => {
        const isLiked = upvotesIncludeUser(post.upvotes, user?._id);
        const isSaved = savedPosts.includes(post._id);
        const isExpanded = expandedPostIds.includes(post._id);
        const showingComments = showComments.includes(post._id);
        const userName = typeof post.user === "string" ? "Anonymous" : post.user.name;
        const userPhoto = typeof post.user === "string" ? null : post.user.profilePhoto;
        const isVerified = typeof post.user !== "string" && post.user.isVerified;
        const isMenuOpen = openMenu === post._id;

        return (
          <article
            key={post._id}
            className="post-card animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={`/profile`} className="relative group">
                  <div className={`p-0.5 rounded-full ${isVerified ? 'story-ring' : ''}`}>
                    <div className="p-0.5 bg-white dark:bg-gray-800 rounded-full">
                      <img
                        src={userPhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                        alt={userName}
                        className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                  {isVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                      <Verified className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/profile`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm">
                        {userName}
                      </h3>
                    </Link>
                    {post.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{getTimeAgo(post.createdAt || new Date().toISOString())}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(isMenuOpen ? null : post._id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10">
                    <button
                      onClick={() => handleCopyLink(post._id)}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Copy link
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                      <Bookmark className="w-4 h-4" />
                      Save post
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                      <UserMinus className="w-4 h-4" />
                      Unfollow
                    </button>
                    <hr className="my-1 border-gray-100 dark:border-gray-700" />
                    <button className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3">
                      <Flag className="w-4 h-4" />
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                {post.title}
              </h2>
              {post.description && (
                <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {isExpanded || post.description.length <= 150 ? (
                    <p>{post.description}</p>
                  ) : (
                    <p>
                      {post.description.slice(0, 150)}...
                      <button
                        onClick={() => toggleExpand(post._id)}
                        className="text-gray-500 dark:text-gray-400 font-medium ml-1 hover:text-green-600"
                      >
                        more
                      </button>
                    </p>
                  )}
                  {isExpanded && post.description.length > 150 && (
                    <button
                      onClick={() => toggleExpand(post._id)}
                      className="text-gray-500 dark:text-gray-400 font-medium hover:text-green-600 mt-1"
                    >
                      Show less
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Post Image with Double Tap */}
            {post.imageUrl && (
              <div
                className="relative bg-gray-100 dark:bg-gray-700 cursor-pointer select-none"
                onClick={() => handleDoubleTap(post._id)}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full object-cover max-h-[500px]"
                  draggable={false}
                />
                {/* Heart Animation on Double Tap */}
                {showHeartAnimation === post._id && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Heart className="w-24 h-24 text-white fill-white like-burst drop-shadow-lg" />
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons - Instagram Style */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post._id, true)}
                    className="group"
                  >
                    <Heart
                      className={`w-6 h-6 transition-all duration-200 ${
                        isLiked
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-500 group-hover:scale-110"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => toggleComments(post._id)}
                    className="group"
                  >
                    <MessageCircle className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-gray-500 group-hover:scale-110 transition-all duration-200" />
                  </button>
                  <button
                    onClick={() => handleShare(post)}
                    className="group"
                  >
                    <Share2 className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-gray-500 group-hover:scale-110 transition-all duration-200" />
                  </button>
                </div>
                <button
                  onClick={() => toggleSave(post._id)}
                  className="group"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-6 h-6 fill-gray-900 dark:fill-white text-gray-900 dark:text-white" />
                  ) : (
                    <Bookmark className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-gray-500 group-hover:scale-110 transition-all duration-200" />
                  )}
                </button>
              </div>

              {/* Likes Count */}
              <div className="mt-2">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                  {post.upvotes?.length || 0} {post.upvotes?.length === 1 ? "like" : "likes"}
                </p>
              </div>

              {/* Caption Preview */}
              {post.description && (
                <div className="mt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white mr-1">{userName}</span>
                    {post.description.length > 100
                      ? `${post.description.slice(0, 100)}...`
                      : post.description}
                  </p>
                </div>
              )}

              {/* View Comments Link */}
              {post.comments && post.comments.length > 0 && !showingComments && (
                <button
                  onClick={() => toggleComments(post._id)}
                  className="text-sm text-gray-500 dark:text-gray-400 mt-1 hover:text-gray-700"
                >
                  View all {post.comments.length} comments
                </button>
              )}
            </div>

            {/* Comments Section */}
            {showingComments && (
              <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                <div className="pt-3">
                  {/* Sample Comments */}
                  {post.comments && post.comments.length > 0 ? (
                    <div className="space-y-3 mb-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                        {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
                      No comments yet. Be the first!
                    </p>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                    />
                    <button
                      className={`text-sm font-semibold transition-colors ${
                        commentText[post._id]
                          ? 'text-green-600 dark:text-green-400 hover:text-green-700'
                          : 'text-green-300 dark:text-green-800 cursor-not-allowed'
                      }`}
                      disabled={!commentText[post._id]}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </InfiniteScroll>
  );
}
