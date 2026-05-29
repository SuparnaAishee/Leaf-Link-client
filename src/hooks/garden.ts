"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createPlant,
  deletePlant,
  deleteScan,
  getDuePlants,
  getMyPlants,
  getMyScans,
  saveScan,
  updatePlant,
  waterPlant,
} from "../services/garden";

// ─── Plants ───
export const usePlants = (enabled: boolean) =>
  useQuery({
    queryKey: ["plants"],
    queryFn: getMyPlants,
    enabled,
  });

export const useDuePlants = (enabled: boolean) =>
  useQuery({
    queryKey: ["plants", "due"],
    queryFn: getDuePlants,
    enabled,
    refetchInterval: enabled ? 60_000 : false,
  });

export const useCreatePlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPlant,
    onSuccess: (data: any) => {
      toast.success(data?.message || "Plant added");
      qc.invalidateQueries({ queryKey: ["plants"] });
    },
    onError: (err: any) => toast.error(err?.message || "Couldn't add plant"),
  });
};

export const useUpdatePlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; data: Record<string, unknown> }) =>
      updatePlant(payload.id, payload.data),
    onSuccess: (data: any) => {
      toast.success(data?.message || "Updated");
      qc.invalidateQueries({ queryKey: ["plants"] });
    },
    onError: (err: any) => toast.error(err?.message || "Update failed"),
  });
};

export const useWaterPlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => waterPlant(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plants"] });
    },
  });
};

export const useDeletePlant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlant(id),
    onSuccess: () => {
      toast.success("Plant removed");
      qc.invalidateQueries({ queryKey: ["plants"] });
    },
  });
};

// ─── AI scans ───
export const useScans = (enabled: boolean) =>
  useQuery({
    queryKey: ["scans"],
    queryFn: getMyScans,
    enabled,
  });

export const useSaveScan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveScan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scans"] });
    },
  });
};

export const useDeleteScan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteScan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scans"] });
    },
  });
};
