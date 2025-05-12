import { User } from "@/types/user";
import api from "../api/client";

/* Avatar */
export async function updateAvatar(avatar: string) {
  const { data } = await api.patch<{ user: User }>("/users/me/avatar", { avatar });
  return data.user;
}

/* Student -> teacher info */
export async function getTeacherInfo() {
  const { data } = await api.get<{ teacher: User }>("/users/me/teacher");
  return data.teacher;
}

/* Teacher -> list of students */
export async function getMyStudents() {
  const { data } = await api.get<{ students: User[] }>("/users/me/students");
  return data.students;
}

/* Cambia contraseña */

export async function changePassword(oldPwd: string, newPwd: string) {
  return api.post("/users/me/change-password", { oldPwd, newPwd });
}