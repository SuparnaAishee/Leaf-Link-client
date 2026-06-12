"use server";

import axiosInstance from "@/src/lib/AxiosInstance";

export const getAdminStats = async () => {
  const { data } = await axiosInstance.get("/meta/admin-stats");

  return data;
};
