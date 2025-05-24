// src/services/notification.service.ts

import api from "@/api/client";

export type Notification = {
  id:   string;
  title:string;
  body: string;
  date: string;
  type: "info" | "warning" | "reward";
  read: boolean;
};

export async function getNotifications(): Promise<Notification[]> {
  const res = await api.get("/notifications");
  return res.data.data as Notification[];
}

export async function createNotification(n: {
  userId: string;
  title:  string;
  body:   string;
  type:   "info" | "warning" | "reward";
}) {
  await api.post("/notifications", n);
}

export async function deleteNotification(id: string) {
  await api.delete(`/notifications/${id}`);
}
