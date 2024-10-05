"use server";

import axiosInstance from "@/src/lib/AxiosInstance";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

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