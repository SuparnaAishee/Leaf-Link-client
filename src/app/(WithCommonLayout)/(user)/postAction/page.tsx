// "use client";
// import { useState, useEffect } from "react";
// import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";

// import { TPost } from "@/src/types/post";
// import { getCurrentUser } from "@/src/services/AuthService";

// export default function PostsPage() {
//   const [posts, setPosts] = useState<TPost[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState(""); // State for selected category
//   const [likedPosts, setLikedPosts] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]); // State to track expanded posts
//   const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
//     {},
//   ); // State to track comment inputs
//   const [showCommentBox, setShowCommentBox] = useState<string | null>(null); // State to toggle comment box visibility

//   // Debounced API call for searching and filtering
//   const fetchPosts = async (searchQuery = "", categoryQuery = "") => {
//     try {
//       setLoading(true);

//       // Construct the URL with both search and category parameters
//       const url = new URL(`https://gardening-tips-platform-server-three.vercel.app/api/posts`);

//       if (searchQuery) url.searchParams.append("searchTerm", searchQuery); // Append search term
//       if (categoryQuery) url.searchParams.append("category", categoryQuery); // Append category filter

//       const res = await fetch(url);

//       if (!res.ok) {
//         console.error("Failed to fetch posts");

//         return;
//       }

//       const response = await res.json();
//       const newPosts: TPost[] = response.data;

//       // Sort posts by upvotes (most popular first)
//       newPosts.sort((a, b) => b.upvotes.length - a.upvotes.length);
//       setPosts(newPosts);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effect to fetch posts on initial load
//   useEffect(() => {
//     fetchPosts(); // Fetch all posts when the component mounts
//   }, []);

//   // Debounce logic for search and category changes
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchPosts(searchTerm, category); // Fetch posts when user stops typing or selects a category
//     }, 500); // 500ms delay to debounce

//     return () => clearTimeout(delayDebounceFn); // Clear timeout if the user types again
//   }, [searchTerm, category]); // Trigger the effect when searchTerm or category changes

//   // Toggle like/unlike for a post
//   const toggleLike = async (postId: string) => {
//     const liked = likedPosts.includes(postId);

//     try {
//       await fetch(`https://gardening-tips-platform-server-three.vercel.app/api/posts/vote`, {
//         method: liked ? "DELETE" : "POST", // Send POST to like, DELETE to unlike
//       });

//       setLikedPosts((prevLiked) =>
//         liked
//           ? prevLiked.filter((id) => id !== postId)
//           : [...prevLiked, postId],
//       );

//       // Optimistically update the post's upvote count in the local state
//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 upvotes: liked
//                   ? post.upvotes.filter((id) => id !== postId) // Remove upvote
//                   : [...post.upvotes, postId], // Add upvote
//               }
//             : post,
//         ),
//       );
//     } catch (error) {
//       console.error("Error toggling like:", error);
//     }
//   };

//   // Share functionality
//   const handleShare = (post: TPost) => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: post.title,
//           text: post.description,
//           url: window.location.href + `/posts/${post._id}`,
//         })
//         .then(() => console.log("Post shared successfully!"))
//         .catch((error) => console.error("Error sharing post:", error));
//     } else {
//       navigator.clipboard.writeText(
//         window.location.href + `/posts/${post._id}`,
//       );
//       alert("Post URL copied to clipboard");
//     }
//   };

//   // Toggle expanded description
//   const toggleExpandedDescription = (postId: string) => {
//     setExpandedPostIds((prev) => {
//       if (prev.includes(postId)) {
//         return prev.filter((id) => id !== postId); // Remove from expanded
//       } else {
//         return [...prev, postId]; // Add to expanded
//       }
//     });
//   };

//   // Toggle comment box visibility
//   const toggleCommentBox = (postId: string) => {
//     setShowCommentBox(showCommentBox === postId ? null : postId);
//   };

//   // Handle comment input change
//   const handleCommentChange = (postId: string, value: string) => {
//     setCommentInputs((prev) => ({
//       ...prev,
//       [postId]: value,
//     }));
//   };

//   // Submit comment to backend
//   const submitComment = async (postId: string) => {
//     const comment = commentInputs[postId];

//     if (!comment) return; // Don't submit empty comments

//     try {
//       await fetch(`https://gardening-tips-platform-server-three.vercel.app/api/posts/add-comment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ comment }),
//       });

//       // Optimistically update the comments locally
//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 comments: [
//                   ...post.comments,
//                   { content: comment, user: { name: "Current User" } },
//                 ],
//               }
//             : post,
//         ),
//       );

//       // Clear the comment input after submission
//       setCommentInputs((prev) => ({
//         ...prev,
//         [postId]: "",
//       }));
//     } catch (error) {
//       console.error("Error submitting comment:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 w-3/4">
//       <h1 className="text-2xl font-bold mb-8 text-center mx-auto pt-8">
//         Explore Posts
//       </h1>
//       <div className="w-1/2 mx-auto">
//         {/* Search Field */}
//         <input
//           className="border p-2 mb-4 w-full rounded-lg"
//           placeholder="Search posts..."
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         {/* Category Selection */}
//         <select
//           className="border p-2 mb-4 w-full rounded-lg"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         >
//           <option value="">Select Category</option>
//           <option value="plant health">Plant Health</option>
//           <option value="landscaping">Vegetables</option>
//           <option value="herbs">Herbs</option>
//           <option value="soil health">Soil Health</option>
//           <option value="techniques">Techniques</option>
//           <option value="Garden Design">Garden Design</option>
//           <option value="seasonal tips">Seasonal Tips</option>
//           <option value="care tips">Care Tips</option>
//           <option value="indoor gardening">Indoor Gardening</option>
//           <option value="fruit gardening">Fruit Gardening</option>
//         </select>
//       </div>
//       {/* Loading Spinner */}
//       {loading && <p className="text-center">Loading posts...</p>}

//       {/* Post List */}
//       {!loading && (
//         <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 p-6">
//           {posts.map((post) => (
//             <div
//               key={post._id}
//               className="card mb-4 border rounded-lg shadow-md p-6 bg-default-black"
//             >
//               <div className="flex items-start mb-2">
//                 <img
//                   alt={post.user?.name || "User Avatar"}
//                   className="w-10 h-10 rounded-full mr-2"
//                   src={post.user?.profilePhoto || "/default-profile.png"}
//                 />
//                 <div>
//                   <h3 className="font-semibold text-sm">{post.user?.name}</h3>
//                   <p className="text-gray-500 text-xs">Just now</p>
//                 </div>
//               </div>

//               {post.imageUrl && (
//                 <div className="relative w-full h-48">
//                   <img
//                     alt={post.title}
//                     className="absolute inset-0 w-full h-full object-cover rounded-lg mb-2"
//                     src={post.imageUrl}
//                   />
//                 </div>
//               )}

//               <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
//               <p className="text-sm text-gray-700 mb-4">
//                 {expandedPostIds.includes(post._id)
//                   ? post.description
//                   : `${post.description.slice(0, 80)}...`}
//                 {post.description.length > 80 && (
//                   <button
//                     className="text-blue-500 hover:underline text-sm ml-2"
//                     onClick={() => toggleExpandedDescription(post._id)}
//                   >
//                     {expandedPostIds.includes(post._id)
//                       ? "Show less"
//                       : "Show more"}
//                   </button>
//                 )}
//               </p>

//               <div className="flex justify-between items-center">
//                 {/* Like Button */}
//                 <button
//                   className={`flex items-center ${
//                     likedPosts.includes(post._id)
//                       ? "text-red-500"
//                       : "text-gray-400"
//                   }`}
//                   onClick={() => toggleLike(post._id)}
//                 >
//                   {likedPosts.includes(post._id) ? (
//                     <FaHeart className="mr-1" />
//                   ) : (
//                     <FaRegHeart className="mr-1" />
//                   )}
//                   <span className="text-sm">{post.upvotes.length}</span>
//                 </button>

//                 {/* Comment Button */}
//                 <button
//                   className="text-blue-500 hover:underline text-sm"
//                   onClick={() => toggleCommentBox(post._id)}
//                 >
//                   Comment
//                 </button>

//                 {/* Share Button */}
//                 <button
//                   className="text-gray-400"
//                   onClick={() => handleShare(post)}
//                 >
//                   <FaShareAlt />
//                 </button>
//               </div>

//               {/* Comment Section */}
//               {showCommentBox === post._id && (
//                 <div className="mt-4">
//                   {/* Comment Input */}
//                   <textarea
//                     className="w-full border rounded-lg p-2"
//                     placeholder="Add a comment..."
//                     value={commentInputs[post._id] || ""}
//                     onChange={(e) =>
//                       handleCommentChange(post._id, e.target.value)
//                     }
//                   />

//                   {/* Submit Comment Button */}
//                   <button
//                     className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
//                     onClick={() => submitComment(post._id)}
//                   >
//                     Submit Comment
//                   </button>

//                   {/* Display Comments */}
//                   <div className="mt-4">
//                     {post.comments.map((comment, idx) => (
//                       <div key={idx} className="mb-2">
//                         <p className="font-semibold text-sm">
//                           {comment.user?.name || "Anonymous"}
//                         </p>
//                         <p className="text-gray-600 text-sm">
//                           {comment.content}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";

import { TPost } from "@/src/types/post";

export default function PostsPage() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState(""); // State for selected category
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]); // State to track expanded posts

  // Debounced API call for searching and filtering
  const fetchPosts = async (searchQuery = "", categoryQuery = "") => {
    try {
      setLoading(true);

      // Construct the URL with both search and category parameters
      const url = new URL(
        `https://gardening-tips-platform-server-three.vercel.app/api/posts`
      );

      if (searchQuery) url.searchParams.append("searchTerm", searchQuery); // Append search term
      if (categoryQuery) url.searchParams.append("category", categoryQuery); // Append category filter

      const res = await fetch(url);

      if (!res.ok) {
        console.error("Failed to fetch posts");

        return;
      }

      const response = await res.json();
      const newPosts: TPost[] = response.data;

      // Filter to include only posts where isPremium is false
      const nonPremiumPosts = newPosts.filter(
        (post) => post.isPremium === false,
      );

      // Sort posts by upvotes (most popular first)
      nonPremiumPosts.sort((a, b) => b.upvotes.length - a.upvotes.length);
      setPosts(nonPremiumPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch posts on initial load
  useEffect(() => {
    fetchPosts(); // Fetch all posts when the component mounts
  }, []);

  // Debounce logic for search and category changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts(searchTerm, category); // Fetch posts when user stops typing or selects a category
    }, 500); // 500ms delay to debounce

    return () => clearTimeout(delayDebounceFn); // Clear timeout if the user types again
  }, [searchTerm, category]); // Trigger the effect when searchTerm or category changes

  // Toggle like/unlike for a post
  const toggleLike = async (postId: string) => {
    const liked = likedPosts.includes(postId);

    try {
      await fetch(
        `https://gardening-tips-platform-server-three.vercel.app/api/posts/${postId}/upvote`,
        {
          method: liked ? "DELETE" : "POST", // Send POST to like, DELETE to unlike
        }
      );

      setLikedPosts((prevLiked) =>
        liked
          ? prevLiked.filter((id) => id !== postId)
          : [...prevLiked, postId],
      );

      // Optimistically update the post's upvote count in the local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                upvotes: liked
                  ? post.upvotes.filter((id) => id !== postId) // Remove upvote
                  : [...post.upvotes, postId], // Add upvote
              }
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
      navigator
        .share({
          title: post.title,
          text: post.description,
          url: window.location.href + `/posts/${post._id}`,
        })
        .then(() => console.log("Post shared successfully!"))
        .catch((error) => console.error("Error sharing post:", error));
    } else {
      navigator.clipboard.writeText(
        window.location.href + `/posts/${post._id}`,
      );
      alert("Post URL copied to clipboard");
    }
  };

  // Toggle expanded description
  const toggleExpandedDescription = (postId: string) => {
    setExpandedPostIds((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId); // Remove from expanded
      } else {
        return [...prev, postId]; // Add to expanded
      }
    });
  };

  return (
    <div className="container mx-auto px-4 w-3/4">
      <h1 className="text-2xl font-bold mb-8 text-center mx-auto pt-8">
        Explore Posts
      </h1>
      <div className="w-1/2 mx-auto">
        {/* Search Field */}
        <input
          className="border p-2 mb-4 w-full rounded-lg"
          placeholder="Search posts..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category Selection */}
        <select
          className="border p-2 mb-4 w-full rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="plant health">Plant Health</option>

          <option value="herbs">Herbs</option>
          <option value="soil health">Soil Health</option>
          <option value="techniques">Techniques</option>
          <option value="Garden Design">Garden Design</option>
          <option value="seasonal tips">Seasonal Tips</option>
          <option value="care tips">Care Tips</option>
          <option value="indoor gardening">Indoor Gardening</option>
          <option value="fruit gardening">Fruit Gardening</option>
          {/* <option value="landscaping">Vegetables</option> */}
          {/* Add more categories as needed */}
        </select>
      </div>
      {/* Loading Spinner */}
      {loading && <p className="text-center">Loading posts...</p>}

      {/* Post List */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="card mb-4 border rounded-lg shadow-md p-6 bg-default-black"
            >
              <div className="flex items-start mb-2">
                <img
                  alt={post.user?.name || "User Avatar"}
                  className="w-10 h-10 rounded-full mr-2"
                  src={post.user?.profilePhoto || "/default-profile.png"}
                />
                <div>
                  <h3 className="font-semibold text-sm">{post.user?.name}</h3>
                  <p className="text-gray-500 text-xs">Just now</p>
                </div>
              </div>

              {post.imageUrl && (
                <div className="relative w-full h-48">
                  <img
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg mb-2"
                    src={post.imageUrl}
                  />
                </div>
              )}

              <h2 className="text-md font-bold mb-1 mt-2">{post.title}</h2>
              <h2 className="text-md font-bold mb-1 mt-2">{post.category}</h2>

              <p className="text-gray-700 mb-2">
                {expandedPostIds.includes(post._id)
                  ? post.description
                  : `${post.description.slice(0, 100)}...`}
                <button
                  className="text-blue-500 ml-2"
                  onClick={() => toggleExpandedDescription(post._id)}
                >
                  {expandedPostIds.includes(post._id) ? "See Less" : "See More"}
                </button>
              </p>

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
                    💬 <span className="ml-1">{post.comments.length}</span>
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
        </div>
      )}
    </div>
  );
}
