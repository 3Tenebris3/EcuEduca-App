// src/services/leaderboard.service.ts
import { avatarKeys, avatars } from "@/constants/avatar";
import api from "../api/client";

export interface Row {
  id: string;
  avatar: string;   // avatar5.png
  name: string;
  points: number;
  rank: number;
}

export async function fetchLeaderboard() {
  const { data } = await api.get<{ rows: Row[] }>("/leaderboard");
  return data.rows;
}

/* helper para obtener la imagen local */
export function avatarSrc(fileName: string) {
  const idx = avatarKeys.findIndex((k) => k === fileName);
  return avatars[idx >= 0 ? idx : 0];
}
