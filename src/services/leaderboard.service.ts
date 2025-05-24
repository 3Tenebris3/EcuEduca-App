import api from "@/api/client";

/* ---------- Tipos ---------- */
export type Row = {
  id: string;           // uid
  name: string;
  avatar: string;       // "avatar7.png"
  points: number;
  rank: number;         // calculado por el backend
};

/* ---------- HTTP ---------- */
export async function fetchLeaderboard(): Promise<Row[]> {
  const res = await api.get("/leaderboard");
  // backend usa { ok, status, message, data }
  return res.data.data as Row[];
}

/**
 * Sumar puntos al usuario autenticado.
 * @param delta  puntos a agregar
 * @param name   nombre (solo la 1ª vez o si cambió)
 * @param avatar nombre de archivo del avatar
 */
export async function addPoints(delta: number, name: string, avatar: string) {
  await api.post("/leaderboard/add", { delta, name, avatar });
}

/* ---------- util avatar → require(...) ---------- */
export function avatarSrc(file: string) {
  switch (file) {
    case "avatar1.png":  return require("../../assets/avatars/avatar1.png");
    case "avatar2.png":  return require("../../assets/avatars/avatar2.png");
    case "avatar7.png":  return require("../../assets/avatars/avatar7.png");
    case "avatar9.png":  return require("../../assets/avatars/avatar9.png");
    case "avatar14.png": return require("../../assets/avatars/avatar14.png");
    default:             return require("../../assets/avatars/avatar1.png");
  }
}
