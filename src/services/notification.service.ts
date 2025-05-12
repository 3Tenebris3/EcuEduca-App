import api from "../api/client";

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;   // ISO
  type: "info" | "warning" | "reward";
  read: boolean;
}

export async function getNotifications() {
  const { data } = await api.get<{ data: Notification[] }>("/notifications");
  return data.data;
}

export async function deleteNotification(id: string) {
  return api.delete(`/notifications/${id}`);
}

export async function createNotification(payload: {
  userId: string;
  title: string;
  body: string;
  type?: "info" | "warning" | "reward";
}) {
  return api.post("/notifications", payload);
}
