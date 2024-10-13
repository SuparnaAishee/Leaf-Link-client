"use client";
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";

import { TPost } from "@/src/types/post";

export default function PostsPage() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false); // State for user status

  // Fetch user status on component mount (you may need to adjust this based on your auth implementation)
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/status"); // Endpoint to check user status

        if (!res.ok) {
          throw new Error("Failed to fetch user status");
        }
        const data = await res.json();

        setIsPremiumUser(data.isPremium); // Assuming the response contains a field isPremium
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    checkUserStatus();
  }, []);

  const fetchPosts = async (searchQuery = "", categoryQuery = "") => {
    try {
      setLoading(true);
      const url = new URL(`http://localhost:5000/api/posts`);

      if (searchQuery) url.searchParams.append("searchTerm", searchQuery);
      if (categoryQuery) url.searchParams.append("category", categoryQuery);

      const res = await fetch(url);

      if (!res.ok) {
        console.error("Failed to fetch posts");

        return;
      }

      const response = await res.json();
      const newPosts: TPost[] = response.data;

      // Filter posts to show only premium posts
      const premiumPosts = newPosts.filter((post) => post.isPremium);

      // Sort posts by upvotes (most popular first)
      premiumPosts.sort((a, b) => b.upvotes.length - a.upvotes.length);
      setPosts(premiumPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts(searchTerm, category);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category]);

  const toggleLike = async (postId: string) => {
    const liked = likedPosts.includes(postId);

    try {
      await fetch(`http://localhost:5000/api/posts/${postId}/upvote`, {
        method: liked ? "DELETE" : "POST",
      });

      setLikedPosts((prevLiked) =>
        liked
          ? prevLiked.filter((id) => id !== postId)
          : [...prevLiked, postId],
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                upvotes: liked
                  ? post.upvotes.filter((id) => id !== postId)
                  : [...post.upvotes, postId],
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

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

  const toggleExpandedDescription = (postId: string) => {
    setExpandedPostIds((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  return (
    <div className="container mx-auto px-4 w-3/4">
      <h1 className="text-2xl font-bold mb-8 text-center mx-auto pt-8">
        Explore Premium Posts
      </h1>
      <div className="w-1/2 mx-auto">
        <input
          className="border p-2 mb-4 w-full rounded-lg"
          placeholder="Search posts..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 mb-4 w-full rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="plant health">Plant Health</option>
          <option value="landscaping">Vegetables</option>
          <option value="herbs">Herbs</option>
          <option value="soil health">Soil Health</option>
          <option value="techniques">Techniques</option>
          <option value="Garden Design">Garden Design</option>
          <option value="seasonal tips">Seasonal Tips</option>
          <option value="care tips">Care Tips</option>
          <option value="indoor gardening">Indoor Gardening</option>
          <option value="fruit gardening">Fruit Gardening</option>
        </select>
      </div>
      {loading && <p className="text-center">Loading posts...</p>}
      {!loading && posts.length === 0 && (
        <p className="text-center">No premium posts available.</p>
      )}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 p-6">
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

// "use client";
// import { useState, useEffect } from "react";
// import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";
// import { TPost } from "@/src/types/post";

// export default function PostsPage() {
//   const [posts, setPosts] = useState<TPost[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("");
//   const [likedPosts, setLikedPosts] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
//   const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false); // State for user status

//   // Fetch user status on component mount (you may need to adjust this based on your auth implementation)
//   useEffect(() => {
//     const checkUserStatus = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/user/status"); // Endpoint to check user status
//         if (!res.ok) {
//           throw new Error("Failed to fetch user status");
//         }
//         const data = await res.json();
//         setIsPremiumUser(data.isPremium); // Assuming the response contains a field isPremium
//       } catch (error) {
//         console.error("Error fetching user status:", error);
//       }
//     };

//     checkUserStatus();
//   }, []);

//   const fetchPosts = async (searchQuery = "", categoryQuery = "") => {
//     try {
//       setLoading(true);
//       const url = new URL(`http://localhost:5000/api/posts`);
//       if (searchQuery) url.searchParams.append("searchTerm", searchQuery);
//       if (categoryQuery) url.searchParams.append("category", categoryQuery);

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

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchPosts(searchTerm, category);
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm, category]);

//   const toggleLike = async (postId: string) => {
//     const liked = likedPosts.includes(postId);

//     try {
//       await fetch(`http://localhost:5000/api/posts/${postId}/upvote`, {
//         method: liked ? "DELETE" : "POST",
//       });

//       setLikedPosts((prevLiked) =>
//         liked ? prevLiked.filter((id) => id !== postId) : [...prevLiked, postId]
//       );

//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 upvotes: liked
//                   ? post.upvotes.filter((id) => id !== postId)
//                   : [...post.upvotes, postId],
//               }
//             : post
//         )
//       );
//     } catch (error) {
//       console.error("Error toggling like:", error);
//     }
//   };

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
//         window.location.href + `/posts/${post._id}`
//       );
//       alert("Post URL copied to clipboard");
//     }
//   };

//   const toggleExpandedDescription = (postId: string) => {
//     setExpandedPostIds((prev) => {
//       if (prev.includes(postId)) {
//         return prev.filter((id) => id !== postId);
//       } else {
//         return [...prev, postId];
//       }
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 w-3/4">
//       <h1 className="text-2xl font-bold mb-8 text-center mx-auto pt-8">
//         Explore Posts
//       </h1>
//       <div className="w-1/2 mx-auto">
//         <input
//           type="text"
//           placeholder="Search posts..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 mb-4 w-full rounded-lg"
//         />
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="border p-2 mb-4 w-full rounded-lg"
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
//       {loading && <p className="text-center">Loading posts...</p>}
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

//               <h2 className="text-md font-bold mb-1 mt-2">{post.title}</h2>
//               <h2 className="text-md font-bold mb-1 mt-2">{post.category}</h2>

//               <p className="text-gray-700 mb-2">
//                 {expandedPostIds.includes(post._id)
//                   ? post.description
//                   : `${post.description.slice(0, 100)}...`}
//                 <button
//                   onClick={() => toggleExpandedDescription(post._id)}
//                   className="text-blue-500 ml-2"
//                 >
//                   {expandedPostIds.includes(post._id) ? "See Less" : "See More"}
//                 </button>
//               </p>

//               {/* Check if the post is premium and if the user has premium status */}
//               {post.isPremium && !isPremiumUser && (
//                 <p className="text-red-500 font-bold">
//                   This content is for premium users only. Upgrade to access.
//                 </p>
//               )}

//               <div className="flex justify-between items-center mt-2">
//                 <div className="flex items-center">
//                   <button
//                     className="text-red-500 hover:text-red-700 flex items-center"
//                     onClick={() => toggleLike(post._id)}
//                   >
//                     {likedPosts.includes(post._id) ? (
//                       <FaHeart className="w-5 h-5" />
//                     ) : (
//                       <FaRegHeart className="w-5 h-5" />
//                     )}
//                     <span className="ml-1">{post.upvotes.length}</span>
//                   </button>

//                   <button className="text-blue-500 hover:underline flex items-center ml-4">
//                     💬 <span className="ml-1">{post.comments.length}</span>
//                   </button>
//                 </div>

//                 <button
//                   className="text-gray-500 hover:text-gray-700 flex items-center"
//                   onClick={() => handleShare(post)}
//                 >
//                   <FaShareAlt className="w-5 h-5" />
//                   <span className="ml-1">Share</span>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
