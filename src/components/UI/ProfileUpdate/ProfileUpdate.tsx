"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/src/context/user.provider";
import { useGetMe, useUpdateProfile } from "@/src/hooks/profile";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
import { logout, getCurrentUser } from "@/src/services/AuthService";

import LLInput from "../../form/LLInput";
import LLForm from "../../form/LLFrom";

// Define the User type
interface User {
  name: string;
  mobileNumber: string;
  email: string;
  profilePhoto: string;
}

const ProfileUpdate = () => {
  const { setIsLoading: setUserLoading } = useUser();
  const [user, setUser] = useState<User | null>(null); // Use the User type here
  const { mutate: handleUpdateProfile } = useUpdateProfile();
  const [imageFiles, setImageFiles] = useState<File | null>(null); // Adjust to File | null
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch the current user when the component mounts
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        // Assert the type if necessary
        setUser(currentUser as User); // Use type assertion here
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Set image preview when image files change
    if (imageFiles) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFiles);
    }
  }, [imageFiles]);

  const handleSubmit: SubmitHandler<FieldValues> = async (profileData) => {
    setLoading(true);
    let payload = { ...profileData };

    if (imageFiles) {
      const imageUrl = await uploadToCloudinary(imageFiles, "image");
      payload.profilePhoto = imageUrl;
    }

    handleUpdateProfile(payload, {
      onSuccess() {
        setLoading(false);
        logout();
        setUserLoading(true);
        router.push("/");
      },
      onError() {
        setLoading(false);
      },
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Safely access the first file
    setImageFiles(file);
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading state until user data is available
  }

  return (
    <div>
      <LLForm
        defaultValues={{
          name: user.name,
          mobileNumber: user.mobileNumber,
          email: user.email,
        }}
        onSubmit={handleSubmit}
      >
        <div className="md:flex">
          <div className="py-4 pl-5 flex-1 container-box">
            <div className="w-full py-2.5">
              <h1 className="font-bold text-xl mb-2">Account Information </h1>

              <div className="mb-2">
                <LLInput label="Name" type="text" name="name" />
              </div>

              <div className="mb-2">
                <LLInput
                  label="Mobile Number"
                  type="text"
                  name="mobileNumber"
                />
              </div>

              <div className="mb-2">
                <LLInput
                  readOnly={true}
                  disabled={true}
                  label="Email"
                  type="email"
                  name="email"
                />
              </div>

              <div className="mb-2">
                <div className="min-w-fit">
                  <label
                    className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-default-200 text-default-500 shadow-sm transition-all duration-100 hover:border-default-400"
                    htmlFor="image"
                  >
                    Upload image
                  </label>
                  <input
                    multiple
                    className="hidden"
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end w-full mt-5">
                <Button isLoading={loading} type="submit">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="py-4 pl-5 flex-1">
            <div className="w-full py-2.5">
              {imagePreview ? (
                <div className="relative rounded-xl h-[300px] border-2 border-dashed border-default-300 p-2">
                  <img
                    alt="item"
                    className="h-full w-full object-cover object-center rounded-md"
                    src={imagePreview}
                  />
                </div>
              ) : (
                <div className="relative rounded-xl h-[300px] border-2 border-dashed border-default-300 p-2">
                  <img
                    alt="item"
                    className="h-full w-full object-cover object-center rounded-md"
                    src={user.profilePhoto}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </LLForm>
    </div>
  );
};

export default ProfileUpdate;

// "use client";
// import { useEffect, useState } from "react";
// import { useUser } from "@/src/context/user.provider";
// import { useGetMe, useUpdateProfile } from "@/src/hooks/profile";
// import { Button } from "@nextui-org/button";
// import { useRouter } from "next/navigation";
// import { ChangeEvent } from "react";
// import { FieldValues, SubmitHandler } from "react-hook-form";
// import LLForm from "../../form/LLFrom";
// import LLInput from "../../form/LLInput";
// import { logout } from "@/src/services/AuthService";
// import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";

// const ProfileUpdate = () => {
//   const { setIsLoading: setUserLoading, user } = useUser();
//   const { data } = useGetMe(user?.email as string);
//   const { mutate: handleUpdateProfile } = useUpdateProfile();
//   const [imageFiles, setImageFiles] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     if (imageFiles) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(imageFiles);
//     } else {
//       setImagePreview(null);
//     }
//   }, [imageFiles]);

//   const handleSubmit: SubmitHandler<FieldValues> = async (profileData) => {
//     setLoading(true);
//     let payload: FieldValues = { ...profileData };

//     if (imageFiles) {
//       try {
//         const imageUrl = await uploadToCloudinary(imageFiles, "image");
//         payload.profilePhoto = imageUrl; // Add the image URL to the payload
//       } catch (error) {
//         console.error("Image upload failed:", error);
//         setLoading(false);
//         return; // Exit early on image upload failure
//       }
//     }

//     handleUpdateProfile(payload, {
//       onSuccess() {
//         setLoading(false);
//         logout();
//         setUserLoading(true);
//         router.push("/");
//       },
//       onError() {
//         setLoading(false);
//       },
//     });
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null; // Select the first file or null
//     setImageFiles(file);
//   };

//   if (!data?.data) {
//     console.log(data?.data)
//     return null;
//   }

//   return (
//     <div>
//       <LLForm
//         defaultValues={{
//           name: data?.data?.name,
//           mobileNumber: data?.data?.mobileNumber,
//           email: data?.data?.email,

//         }}
//         onSubmit={handleSubmit}
//       >
//         <div className="md:flex">
//           <div className="py-4 pl-5 flex-1 container-box">
//             <div className="w-full py-2.5">
//               <h1 className="font-bold text-xl mb-2">Account Information</h1>

//               <div className="mb-2">
//                 <LLInput label="Name" type="text" name="name" />
//               </div>

//               <div className="mb-2">
//                 <LLInput
//                   label="Mobile Number"
//                   type="text"
//                   name="mobileNumber"
//                 />
//               </div>

//               <div className="mb-2">
//                 <LLInput
//                   readOnly={true}
//                   disabled={true}
//                   label="Email"
//                   type="email"
//                   name="email"
//                 />
//               </div>

//               <div className="mb-2">
//                 <div className="min-w-fit">
//                   <label
//                     className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-default-200 text-default-500 shadow-sm transition-all duration-100 hover:border-default-400"
//                     htmlFor="image"
//                   >
//                     Upload image
//                   </label>
//                   <input
//                     className="hidden"
//                     id="image"
//                     type="file"
//                     onChange={handleImageChange}
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center justify-end w-full mt-5">
//                 <Button isLoading={loading} type="submit">
//                   Save Changes
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <div className="py-4 pl-5 flex-1">
//             <div className="w-full py-2.5">
//               {imagePreview ? (
//                 <div className="relative rounded-xl h-[300px] border-2 border-dashed border-default-300 p-2">
//                   <img
//                     alt="Uploaded preview"
//                     className="h-full w-full object-cover object-center rounded-md"
//                     src={imagePreview}
//                   />
//                 </div>
//               ) : (
//                 <div className="relative rounded-xl h-[300px] border-2 border-dashed border-default-300 p-2">
//                   <img
//                     alt="Current profile"
//                     className="h-full w-full object-cover object-center rounded-md"
//                     src={data?.data?.profilePhoto}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </LLForm>
//     </div>
//   );
// };

// export default ProfileUpdate;
