"use client";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

import { SidebarOptions } from "./SidebarOptions";
import { adminLinks, userLinks } from "./constants";

import { useUser } from "@/src/context/user.provider";

const Sidebar = () => {
  const { user } = useUser();
  const isVerified = user?.isVerified;

  return (
    <div>
      <div className="rounded-xl bg-default-100 p-2">
        <div className="h-[330px] w-full rounded-md overflow-hidden border border-gray-300 flex items-center justify-center">
          <Image
            alt="profile"
            className="rounded"
            height={200}
            src={user?.profilePhoto || "/default-avatar.png"} // Fallback image if profilePhoto is not available
            width={300}
          />
        </div>
        <div className="my-3 pl-6 pr-4">
          <h1 className="text-2xl font-semibold flex items-center">
            {user?.name}
            {isVerified && (
              <FaCheckCircle className="text-purple-500 ml-2" /> // Check icon next to the name
            )}
            {!isVerified && (
              <span className="ml-2 text-red-500">Not Verified</span>
            )}
          </h1>
          <p className="break-words text-sm">
            Bio: {user?.bio || "No bio available"}
          </p>
          <p className="break-words text-sm">{user?.email}</p>

          <div className="mt-2 flex justify-between text-center">
            <div>
              <span className="block font-bold text-lg">
                {user?.followers?.length || 0}
              </span>
              <span className="text-sm text-gray-500">Followers</span>
            </div>
            <div>
              <span className="block font-bold text-lg">
                {user?.following?.length || 0}
              </span>
              <span className="text-sm text-gray-500">Following</span>
            </div>
          </div>
        </div>
        <Button
          as={Link}
          className="mt-2 w-full rounded-md"
          href={"/profile/create-post"}
        >
          Create a post
        </Button>
      </div>
      <div className="mt-3 space-y-2 rounded-xl bg-default-100 p-2">
        <SidebarOptions
          links={user?.role === "USER" ? userLinks : adminLinks}
        />
      </div>
    </div>
  );
};

export default Sidebar;

// "use client";
// import { Button } from "@nextui-org/button";
// import Link from "next/link";
// import Image from "next/image";

// import { SidebarOptions } from "./SidebarOptions";
// import { adminLinks, userLinks } from "./constants";

// import { useUser } from "@/src/context/user.provider";
// import { Badge } from "@nextui-org/badge";

// const Sidebar = () => {
//   const { user } = useUser();
//   console.log("User:", user);
// const isVerified = user?.isVerified;
// console.log("Is Verified:", user?.isVerified);
//   return (
//     <div>
//       <div className="rounded-xl bg-default-100 p-2">
//         <div className="h-[330px] w-full rounded-md overflow-hidden border border-gray-300 flex items-center justify-center">
//           <Image
//             alt="profile"
//             height={200}
//             src={user?.profilePhoto || "/default-avatar.png"} // Fallback image if profilePhoto is not available
//             width={300}
//             className="rounded"
//           />
//         </div>
//         <div className="my-3">
//           <h1 className="text-2xl font-semibold">
//             {user?.name}{" "}
//             {isVerified ? (
//               <Badge color="success" className="ml-2" variant="flat">
//                 Verified
//               </Badge>
//             ) : (
//               <span className="ml-2 text-red-500">Not Verified</span> // Add text to check if badge doesn't show
//             )}
//           </h1>
//           <p className="break-words text-sm">
//             Bio: {user?.bio || "No bio available"}
//           </p>
//           <p className="break-words text-sm">{user?.email}</p>

//           <div className="mt-2 flex justify-between text-center">
//             <div>
//               <span className="block font-bold text-lg">
//                 {user?.followers?.length || 0}
//               </span>
//               <span className="text-sm text-gray-500">Followers</span>
//             </div>
//             <div>
//               <span className="block font-bold text-lg">
//                 {user?.following?.length || 0}
//               </span>
//               <span className="text-sm text-gray-500">Following</span>
//             </div>
//           </div>
//         </div>
//         <Button
//           as={Link}
//           className="mt-2 w-full rounded-md"
//           href={"/profile/create-post"}
//         >
//           Create a post
//         </Button>
//       </div>
//       <div className="mt-3 space-y-2 rounded-xl bg-default-100 p-2">
//         <SidebarOptions
//           links={user?.role === "USER" ? userLinks : adminLinks}
//         />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// "use client";
// import { Button } from "@nextui-org/button";
// import Link from "next/link";
// import Image from "next/image";

// import { SidebarOptions } from "./SidebarOptions";
// import { adminLinks, userLinks } from "./constants";
// import { useUser } from "@/src/context/user.provider";

// import { useState } from "react";
// import { useFollowUnfollow } from "@/src/hooks/follow";

// const Sidebar = () => {
//   const { user } = useUser();
//   const [isFollowing, setIsFollowing] = useState<boolean>(false); // Track follow/unfollow state
//   const followUnfollowMutation = useFollowUnfollow(); // Hook to handle follow/unfollow

//   // Handle follow/unfollow action
//   const handleFollowUnfollow = async () => {
//     try {
//       await followUnfollowMutation.mutateAsync({ followingId: user?._id });
//       setIsFollowing(!isFollowing); // Toggle following state
//     } catch (error) {
//       console.error("Error in follow/unfollow:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="rounded-xl bg-default-100 p-2">
//         <div className="h-[330px] w-full rounded-md overflow-hidden border border-gray-300 flex items-center justify-center">
//           <Image
//             alt="profile"
//             height={200}
//             src={user?.profilePhoto as string}
//             width={300}
//             className="rounded"
//           />
//         </div>
//         <div className="my-3">
//           <h1 className="text-2xl font-semibold">{user?.name}</h1>
//           <p className="break-words text-sm">
//             Bio: {user?.bio || "No bio available"}
//           </p>
//           <p className="break-words text-sm">{user?.email}</p>
//         </div>

//         {/* Follow/Unfollow button */}
//         <Button
//           className="mt-2 w-full rounded-md"
//           onPress={handleFollowUnfollow}
//           isLoading={followUnfollowMutation.isLoading} // Show loading when the mutation is in progress
//         >
//           {isFollowing ? "Unfollow" : "Follow"}
//         </Button>

//         <Button
//           as={Link}
//           className="mt-2 w-full rounded-md"
//           href={"/profile/create-post"}
//         >
//           Create a post
//         </Button>
//       </div>

//       <div className="mt-3 space-y-2 rounded-xl bg-default-100 p-2">
//         <SidebarOptions
//           links={user?.role === "USER" ? userLinks : adminLinks}
//         />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
