"use server";

import axiosInstance from "@/src/lib/AxiosInstance";

export const listEvents = async (scope: "upcoming" | "past" | "all" = "upcoming") => {
  const { data } = await axiosInstance.get(`/events`, { params: { scope } });
  return data;
};

export const listUpcomingForSidebar = async () => {
  const { data } = await axiosInstance.get(`/events/upcoming/list`);
  return data;
};

export const getEvent = async (id: string) => {
  const { data } = await axiosInstance.get(`/events/${id}`);
  return data;
};

export const createEvent = async (payload: Record<string, unknown>) => {
  const { data } = await axiosInstance.post(`/events`, payload);
  return data;
};

export const updateEvent = async (
  id: string,
  payload: Record<string, unknown>
) => {
  const { data } = await axiosInstance.patch(`/events/${id}`, payload);
  return data;
};

export const deleteEvent = async (id: string) => {
  const { data } = await axiosInstance.delete(`/events/${id}`);
  return data;
};

export const toggleRsvp = async (id: string) => {
  const { data } = await axiosInstance.post(`/events/${id}/rsvp`);
  return data;
};
