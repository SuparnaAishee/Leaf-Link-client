"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

import axiosInstance from "@/src/lib/AxiosInstance";
export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const logout = () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};
export const getCurrentUser = async () => {
  const accessToken = cookies().get("accessToken")?.value;

  console.log("Access Token: ", accessToken);
  let decodedToken = null;

  if (accessToken) {
    decodedToken = await jwtDecode(accessToken);

    // return {
    //   _id: decodedToken._id,
    //   name: decodedToken.name,
    //   email: decodedToken.email,
    //   mobileNumber: decodedToken.mobileNumber,
    //   role: decodedToken.role,
    //   status: decodedToken.status,
    //   profilePhoto: decodedToken.profilePhoto,
    //   bio: decodedToken.bio,
    //   isVerified: decodedToken?.isVerified,
    //   premiumStatus: decodedToken?.premiumStatus,
    //   followers: decodedToken?.followers,
    //   following: decodedToken?.following,
    //   posts: decodedToken?.posts,
    //   favorites: decodedToken?.favorites,
    //   createdAt: decodedToken?.createdAt,
    //   updatedAt: decodedToken?.updatedAt,
    //   __v: decodedToken?.__v,
    // };
    return {
      _id: decodedToken._id,
      name: decodedToken.name,
      email: decodedToken.email,
      mobileNumber: decodedToken.mobileNumber || "", // Default to empty string if not available
      role: decodedToken.role,
      status: decodedToken.status,
      profilePhoto: decodedToken.profilePhoto || "", // Default to empty string if not available
      bio: decodedToken.bio || "", // Default to empty string if not available
      isVerified: decodedToken.isVerified || false, // Ensure it defaults to false if not available
      isFollowing: decodedToken.isFollowing || [], // Ensure it's an array or default to an empty array
      followers: decodedToken.followers || [], // Ensure it's an array or default to an empty array
      following: decodedToken.following || [], // Ensure it's an array or default to an empty array
      createdAt: decodedToken.createdAt || "", // Default to empty string if not available
      updatedAt: decodedToken.updatedAt || "", // Default to empty string if not available
    };
  }

  return decodedToken;
};

// "use server";

// import axiosInstance from "@/src/lib/AxiosInstance";
// import { FieldValues } from "react-hook-form";

// export const registerUser=async(userData:FieldValues)=>{
//   try{
// const res= await axiosInstance.post("/auth/register",userData)

// console.log(res.data)
//   }catch(error:any)
//   {
//     throw new Error(error);
//   }
// };
export const getMe = async () => {
  try {
    const { data }: any = await axiosInstance.get("/profile");

    if (data?.success) {
      return data;
    } else {
      throw new Error(data?.message);
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
