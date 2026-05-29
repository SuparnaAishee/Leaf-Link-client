"use server";

import axiosInstance from "@/src/lib/AxiosInstance";

// ─────── Plants ───────
export const getMyPlants = async () => {
  const { data } = await axiosInstance.get("/plants");
  return data;
};

export const getDuePlants = async () => {
  const { data } = await axiosInstance.get("/plants/due");
  return data;
};

export const createPlant = async (payload: Record<string, unknown>) => {
  const { data } = await axiosInstance.post("/plants", payload);
  return data;
};

export const updatePlant = async (
  id: string,
  payload: Record<string, unknown>
) => {
  const { data } = await axiosInstance.patch(`/plants/${id}`, payload);
  return data;
};

export const waterPlant = async (id: string) => {
  const { data } = await axiosInstance.patch(`/plants/${id}/water`);
  return data;
};

export const deletePlant = async (id: string) => {
  const { data } = await axiosInstance.delete(`/plants/${id}`);
  return data;
};

// ─────── AI scans ───────
export const getMyScans = async () => {
  const { data } = await axiosInstance.get("/ai-scans");
  return data;
};

export const saveScan = async (payload: {
  kind: "identify" | "diagnose";
  imageUrl?: string;
  hint?: string;
  result: unknown;
}) => {
  const { data } = await axiosInstance.post("/ai-scans", payload);
  return data;
};

export const deleteScan = async (id: string) => {
  const { data } = await axiosInstance.delete(`/ai-scans/${id}`);
  return data;
};
