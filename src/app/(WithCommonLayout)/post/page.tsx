"use client";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa"; // Import love and share icons

import { TPost } from "@/src/types/post";

export default function InfiniteScrollPosts({
  selectedCategory,
}: {
  selectedCategory: string;
}) {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]); // Track liked posts

  useEffect(() => {
    fetchPosts();
  }, [page, selectedCategory]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/posts?page=${page}&category=${selectedCategory}`,
      );

      if (!res.ok) {
        console.error("Failed to fetch posts");

        return;
      }

      const response = await res.json();
      const newPosts: TPost[] = response.data;

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Toggle expanded state for a post
  const toggleExpand = (postId: string) => {
    setExpandedPostIds((prevExpanded) =>
      prevExpanded.includes(postId)
        ? prevExpanded.filter((id) => id !== postId)
        : [...prevExpanded, postId],
    );
  };

  // Toggle like/unlike for a post
  const toggleLike = async (postId: string) => {
    const liked = likedPosts.includes(postId);

    try {
      await fetch(`http://localhost:5000/api/posts/${postId}/upvote`, {
        method: liked ? "DELETE" : "POST", // Send POST to like, DELETE to unlike
      });

      setLikedPosts((prevLiked) =>
        liked
          ? prevLiked.filter((id) => id !== postId)
          : [...prevLiked, postId],
      );

      // Optimistically update the post's upvote count in the local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, upvotes: liked ? post.upvotes - 1 : post.upvotes + 1 }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Share functionality
  const handleShare = (post: TPost) => {
    if (navigator.share) {
      // Use Web Share API
      navigator
        .share({
          title: post.title,
          text: post.description,
          url: window.location.href + `/posts/${post._id}`,
        })
        .then(() => console.log("Post shared successfully!"))
        .catch((error) => console.error("Error sharing post:", error));
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(
        window.location.href + `/posts/${post._id}`,
      );
      alert("Post URL copied to clipboard");
    }
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      endMessage={<p className="text-center py-4">No more posts</p>}
      hasMore={hasMore}
      loader={<h4 className="text-center py-4">Loading...</h4>}
      next={() => setPage(page + 1)}
    >
      {posts.map((post) => (
        <div
          key={post._id}
          className="card mb-4 border rounded-lg shadow-md p-6 bg-default-black max-w-md mx-auto"
        >
          <div className="flex items-start mb-2">
            <img
              alt={
                typeof post.user === "string"
                  ? `User ID: ${post.user}`
                  : post.user.name
              }
              className="w-10 h-10 rounded-full mr-2"
              src={
                typeof post.user === "string"
                  ? "/default-profile.png"
                  : post.user.profilePicture || "/default-profile.png"
              }
            />
            <div>
              <h3 className="font-semibold text-sm">
                {typeof post.user === "string"
                  ? `User ID: ${post.user}`
                  : post.user.name}
              </h3>
              <p className="text-gray-500 text-xs">Just now</p>
            </div>
          </div>

          {post.imageUrl && (
            <div className="relative w-full h-48">
              <img
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover rounded-lg mb-2 mt-6"
                src={post.imageUrl}
              />
            </div>
          )}

          <h2 className="text-md font-bold mb-1 mt-12">{post.title}</h2>

          {expandedPostIds.includes(post._id) ? (
            <p className=" mb-2">{post.description}</p>
          ) : (
            <>
              {post.description.length > 100 ? (
                <p className=" mb-2">
                  {post.description.slice(0, 100)}...
                  <button
                    className="text-blue-500 hover:underline ml-1"
                    onClick={() => toggleExpand(post._id)}
                  >
                    See More
                  </button>
                </p>
              ) : (
                <p className="text-gray-700 mb-2">{post.description}</p>
              )}
            </>
          )}

          {expandedPostIds.includes(post._id) && (
            <button
              className="text-blue-500 hover:underline ml-1"
              onClick={() => toggleExpand(post._id)}
            >
              Show Less
            </button>
          )}

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <button
                className="text-red-500 hover:text-red-700 flex items-center"
                onClick={() => toggleLike(post._id)}
              >
                {likedPosts.includes(post._id) ? (
                  <FaHeart className="w-5 h-5" />
                ) : (
                  <FaRegHeart className="w-5 h-5" />
                )}
                <span className="ml-1">{post.upvotes.length}</span>
              </button>

              <button className="text-blue-500 hover:underline flex items-center ml-4">
                <span aria-label="comments" role="img">
                  💬
                </span>
                <span className="ml-1">{post.comments.length}</span>
              </button>
            </div>

            <button
              className="text-gray-500 hover:text-gray-700 flex items-center"
              onClick={() => handleShare(post)}
            >
              <FaShareAlt className="w-5 h-5" />
              <span className="ml-1">Share</span>
            </button>
          </div>
        </div>
      ))}
    </InfiniteScroll>
  );
}
