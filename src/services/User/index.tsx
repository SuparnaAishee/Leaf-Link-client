"use server";

import axiosInstance from "@/src/lib/AxiosInstance";
import { IUpdateUserData } from "@/src/types";

export const getAllUsers = async () => {
  try {
    // Pull a high limit so the admin panel can show/aggregate every user on one page.
    const { data }: any = await axiosInstance.get("/users?limit=1000");

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateUser = async (payload: IUpdateUserData) => {
  try {
    const { data }: any = await axiosInstance.put(
      `/users/update-user/${payload.id}`,
      payload.data,
    );

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMonthlyStats = async () => {
  try {
    const { data }: any = await axiosInstance.get(`/users/stats/monthly`);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
