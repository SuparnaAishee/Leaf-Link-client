"use client";
import React, { useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"; // Importing Heroicons for the search icon

import { TUser } from "@/src/types"; // Adjust the import based on your actual TUser type location
import { getCurrentUser } from "@/src/services/AuthService"; // Assuming getCurrentUser is correctly implemented

const SearchUserPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(
        "https://gardening-tips-platform-server-three.vercel.app/api/users",
        {
          params: { searchTerm: searchQuery, page: 1, limit: 10 }, // Include page and limit if needed
        }
      );

      console.log("API Response:", data); // Log the entire response for debugging

      // Access the users array correctly from the response structure
      if (data && data.success && Array.isArray(data.data.users)) {
        setSearchResults(data.data.users);
        console.log("Search Results:", data.data.users); // Log the stored search results
      } else {
        console.error("Unexpected response structure:", data);
        throw new Error("Unexpected response structure");
      }
    } catch (err: any) {
      console.error("Search error:", err); // Log the error for debugging
      setError("Failed to search users. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    setLoading(true);

    try {
      const currentUser = await getCurrentUser(); // Get the current logged-in user

      if (!currentUser || !currentUser._id) {
        throw new Error("User not authenticated");
      }

      // Send the follow/unfollow request, including credentials (cookies)
      const response = await axios.post(
        "https://gardening-tips-platform-server-three.vercel.app/api/follow",
        {
          userId: currentUser._id,
          followingId: userId,
        },
        {
          withCredentials: true, // This ensures the cookie (accessToken) is sent
        }
      );

      // Optimistically update the UI
      // @ts-ignore
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user._id === userId ? { ...user, isFollowing: !isFollowing } : user
        )
      );

      console.log(response.data.message); // Show success message
    } catch (error) {
      console.error("Follow/Unfollow error:", error);
      setError("Failed to update follow status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Users</h1>

      <form className="mb-4 flex items-center" onSubmit={handleSearch}>
        <div className="relative w-full">
          <input
            className="border p-2 rounded w-full pr-10 bg-default"
            placeholder="Search users by name..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
            type="submit"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        {searchResults.length > 0 ? (
          searchResults.map((user: TUser) => (
            <div key={user._id} className="border p-2 mb-2 rounded">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Bio:</strong> {user.bio || "No bio available"}
              </p>
              <img
                alt={`${user.name}'s profile`}
                className="w-16 h-16 rounded-full"
                src={user.profilePhoto}
              />
              <p>
                <strong>Status:</strong> {user.status}
              </p>
              <p>
                <strong>Profile Verified:</strong>{" "}
                {user.isVerified ? "Yes" : "No"}
              </p>
              <button
                className={`mt-2 p-1 rounded ${
                  user.isFollowing ? "bg-red-500" : "bg-blue-500"
                } text-white`}
                // @ts-ignore

                onClick={() => handleFollowToggle(user._id, user.isFollowing)}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default SearchUserPage;

// /* eslint-disable prettier/prettier */
// "use client";
// import React, { useState } from "react";
// import axios from "axios";
// import { TUser } from "@/src/types"; // Adjust the import based on your actual TUser type location
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"; // Importing Heroicons for the search icon
// import { getCurrentUser } from "@/src/services/AuthService";

// const SearchUserPage = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<TUser[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const { data } = await axios.get("https://gardening-tips-platform-server-three.vercel.app/api/users", {
//         params: { searchTerm: searchQuery, page: 1, limit: 10 }, // Include page and limit if needed
//       });

//       console.log("API Response:", data); // Log the entire response for debugging

//       // Access the users array correctly from the response structure
//       if (data && data.success && Array.isArray(data.data.users)) {
//         setSearchResults(data.data.users);
//         console.log("Search Results:", data.data.users); // Log the stored search results
//       } else {
//         console.error("Unexpected response structure:", data);
//         throw new Error("Unexpected response structure");
//       }
//     } catch (err: any) {
//       console.error("Search error:", err); // Log the error for debugging
//       setError("Failed to search users. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
//   //   setLoading(true); // Set loading state

//   //   try {
//   //     const response = await axios.put("https://gardening-tips-platform-server-three.vercel.app/api/follow", {
//   //       followingId: userId,
//   //     });

//   //     // Update the local state optimistically
//   //     setSearchResults((prevResults) =>
//   //       prevResults.map((user) =>
//   //         user._id === userId ? { ...user, isFollowing: !isFollowing } : user
//   //       )
//   //     );

//   //     // Optionally, show a success message or toast notification
//   //     console.log(response.data.message); // Log or use a toast notification for feedback
//   //   } catch (error) {
//   //     console.error("Follow/Unfollow error:", error);
//   //     setError("Failed to update follow status. Please try again.");
//   //   } finally {
//   //     setLoading(false); // Reset loading state
//   //   }
//   // };
// const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
//   setLoading(true);

//   try {
//     const response = await axios.post("https://gardening-tips-platform-server-three.vercel.app/api/follow", {
//       followingId: userId,

//     });

//     // Optimistically update UI
//     setSearchResults((prevResults) =>
//       prevResults.map((user) =>
//         user._id === userId ? { ...user, isFollowing: !isFollowing } : user
//       )
//     );

//     console.log(response.data.message); // Show success message
//   } catch (error) {
//     console.error("Follow/Unfollow error:", error);
//     setError("Failed to update follow status. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Search Users</h1>

//       <form onSubmit={handleSearch} className="mb-4 flex items-center">
//         <div className="relative w-full">
//           <input
//             type="text"
//             placeholder="Search users by name..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="border p-2 rounded w-full pr-10 bg-default"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded hover:bg-blue-600 transition"
//           >
//             <MagnifyingGlassIcon className="h-5 w-5" />
//           </button>
//         </div>
//       </form>

//       {error && <p className="text-red-500">{error}</p>}

//       <div className="mt-4">
//         {searchResults.length > 0 ? (
//           searchResults.map((user: TUser) => (
//             <div key={user._id} className="border p-2 mb-2 rounded">
//               <p>
//                 <strong>Name:</strong> {user.name}
//               </p>
//               <p>
//                 <strong>Bio:</strong> {user.bio || "No bio available"}
//               </p>
//               <img
//                 src={user.profilePhoto}
//                 alt={`${user.name}'s profile`}
//                 className="w-16 h-16 rounded-full"
//               />
//               <p>
//                 <strong>Status:</strong> {user.status}
//               </p>
//               <p>
//                 <strong>Profile Verified:</strong>{" "}
//                 {user.isVerified ? "Yes" : "No"}
//               </p>
//               <button
//                 onClick={() => handleFollowToggle(user._id, user.isFollowing)}
//                 className={`mt-2 p-1 rounded ${
//                   user.isFollowing ? "bg-red-500" : "bg-blue-500"
//                 } text-white`}
//               >
//                 {user.isFollowing ? "Unfollow" : "Follow"}
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No users found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchUserPage;
