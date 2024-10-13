"use server";

import axiosInstance from "@/src/lib/AxiosInstance";

export const getPaymentHistory = async () => {
  try {
    const { data }: any = await axiosInstance.get(`/payments`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
