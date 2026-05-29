"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  listUpcomingForSidebar,
  toggleRsvp,
  updateEvent,
} from "../services/events";

export const useEvents = (scope: "upcoming" | "past" | "all" = "upcoming") =>
  useQuery({
    queryKey: ["events", scope],
    queryFn: () => listEvents(scope),
  });

export const useUpcomingEvents = (enabled: boolean) =>
  useQuery({
    queryKey: ["events", "sidebar"],
    queryFn: listUpcomingForSidebar,
    enabled,
  });

export const useEvent = (id: string) =>
  useQuery({
    queryKey: ["events", id],
    queryFn: () => getEvent(id),
    enabled: !!id,
  });

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: (data: any) => {
      toast.success(data?.message || "Event created");
      qc.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: any) => toast.error(err?.message || "Couldn't create event"),
  });
};

export const useUpdateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: string; data: Record<string, unknown> }) =>
      updateEvent(p.id, p.data),
    onSuccess: () => {
      toast.success("Event updated");
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      toast.success("Event deleted");
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useToggleRsvp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleRsvp(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
