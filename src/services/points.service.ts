import api from "@/api/client";

/* ---- Tipos ---- */
export interface StudentRow {
  studentId : string;
  name      : string;
  avatar    : string;          // filename o URL (lo que envíe el back)
  points    : number;
  rewards   : string[];        // ids de recompensas obtenidas
}

/* ---- GET lista por clase ---- */
export async function getClassPoints(classId: string) {
  const { data } = await api.get<{ rows: StudentRow[] }>("/teacher/points", {
    params: { classId },
  });
  return data.rows;
}

/* ---- POST ajuste manual ---- */
export async function adjustPoints(payload: {
  studentId: string;
  delta: number;      // + / - puntos
  reason?: string;
}) {
  return api.post("/teacher/points/adjust", payload);
}
