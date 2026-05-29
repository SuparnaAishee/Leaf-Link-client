"use server";

import { FieldValues } from "react-hook-form";

import axiosInstance from "@/src/lib/AxiosInstance";

export const updateProfile = async (payload: FieldValues) => {
  try {
    const { data }: any = await axiosInstance.put("/profile/update", payload);

    if (data?.success) {
      return data;
    } else {
      throw new Error(data?.message);
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const verifyProfile = async (payload: any) => {
  try {
    const { data }: any = await axiosInstance.post("/verify-profile", payload);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
