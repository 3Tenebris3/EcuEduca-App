import { deleteSecure, saveSecure } from "@/utils/storage.util";
import api from "../api/client";
import { User } from "../types/user";

export async function login(payload: { email: string; password: string }) {
  /**
   * Estructura real de la respuesta:
   * {
   *   code: 200,
   *   data: { token: "...", user: { ... } },
   *   message: "Login OK",
   *   error: null,
   *   ssuccess: true
   * }
   */
  const res = await api.post("/auth/login", payload);
  const { token, user } = res.data.data;

  await saveSecure("token", token);
  return user as User;
}

export async function register(payload: {
  displayName: string;
  email: string;
  password: string;
  role?: "student" | "teacher" | "admin" | "parent";
}) {
  try {
    const res = await api.post("/auth/register", payload);
    const { token, user } = res.data.data;
    await saveSecure("token", token);
    return user as User;
  } catch (error) {
    console.log("Register ~ error:", error);
    throw error;
  }
}

/* ---------- LOGOUT ---------- */
export async function logout() {
  await deleteSecure("token");
}

export { User };

