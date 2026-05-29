"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getMyNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notification";

export const useNotifications = (enabled: boolean) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
    enabled,
    refetchInterval: enabled ? 30_000 : false,
  });
};

export const useUnreadCount = (enabled: boolean) => {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: getUnreadCount,
    enabled,
    refetchInterval: enabled ? 30_000 : false,
  });
};

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
