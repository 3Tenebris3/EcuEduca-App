import api from "@/api/client";

export async function getClasses() {
  const { data } = await api.get("/teacher/classes");   // ← nuevo endpoint
  return data.data.classes as { id: string; name: string; grade: string }[];
}
