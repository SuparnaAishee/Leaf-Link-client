"use server";

import axios from "axios"; // Use axios instead of nexiosInstance
import { FieldValues } from "react-hook-form";

export const updateProfile = async (payload: FieldValues) => {
  try {
    const { data }: any = await axios.put("/profile", payload); // Axios put request
    if (data?.success) {
      return data;
    } else {
      throw new Error(data?.message);
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message); // Enhanced error handling
  }
};

export const verifyProfile = async (payload: any) => {
  try {
    const { data }: any = await axios.post("/verify-profile", payload); // Axios post request
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message); // Enhanced error handling
  }
};
