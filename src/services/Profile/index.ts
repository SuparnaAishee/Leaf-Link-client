"use server";

import axios from "axios";
import { FieldValues } from "react-hook-form";
import envConfig from "@/src/config/envConfig";

export const updateProfile = async (payload: FieldValues) => {
  try {
    const { data }: any = await axios.put(
      `${envConfig.baseApi}/profile/update`,
      payload
    );

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
    const { data }: any = await axios.post(
      `${envConfig.baseApi}/verify-profile`,
      payload
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
