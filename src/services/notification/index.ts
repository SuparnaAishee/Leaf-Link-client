"use server";

import axiosInstance from "@/src/lib/AxiosInstance";

export const getMyNotifications = async () => {
  const { data } = await axiosInstance.get("/notifications");
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await axiosInstance.get("/notifications/unread-count");
  return data;
};

export const markNotificationRead = async (id: string) => {
  const { data } = await axiosInstance.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await axiosInstance.patch(`/notifications/read-all`);
  return data;
};
