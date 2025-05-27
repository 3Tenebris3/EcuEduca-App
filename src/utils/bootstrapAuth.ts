/* src/utils/bootstrapAuth.ts */
import api from "@/api/client";
import { useAuthStore } from "@/store/useAuthStore";
import * as SecureStore from "expo-secure-store";

export async function bootstrapAuth() {
  const token = await SecureStore.getItemAsync("token");
  if (!token) return;

  try {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const { data } = await api.get("/users/me");     // o /auth/me
    useAuthStore.getState().setUser(data.user);
  } catch {
    await SecureStore.deleteItemAsync("token");
  }
}
