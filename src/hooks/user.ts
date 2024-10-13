"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { IResponse, IUpdateUserData, IUser, IUserStats } from "../types";
import { getAllUsers, getMonthlyStats, updateUser } from "../services/User";

export const useGetAllUsers = () => {
  return useQuery<IResponse<IUser[]>>({
    queryKey: ["all-users"],
    queryFn: async () => await getAllUsers(),
  });
};
export const useUpdateUser = () => {
  return useMutation<any, Error, IUpdateUserData>({
    mutationKey: ["user"],
    mutationFn: async (payload) => await updateUser(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useGetMonthlyStats = () => {
  return useQuery<IResponse<IUserStats>>({
    queryKey: ["monthly_stats"],
    queryFn: async () => await getMonthlyStats(),
  });
};
