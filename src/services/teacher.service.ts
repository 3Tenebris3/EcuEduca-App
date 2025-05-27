/* --------------------------------------------------------------
   Servicios para profesor
   -------------------------------------------------------------- */
import api from "@/api/client";

/* ---- Tipos ---- */
export interface KidRow  { id:string; name:string; avatar?:string }
export interface SceneRow{ kidId:string; kidName:string; done:boolean }
export interface GameRow { kidId:string; kidName:string; score:number }
export interface RewardRow{ kidId:string; kidName:string; points:number;
                            claimed:boolean }

/* ---- Endpoints ---- */

/* listado escenarios */
export async function getSceneProgress(sceneId:string) {
  const { data } = await api.get<{ rows:SceneRow[] }>(
    `/teacher/scenes/${sceneId}`);
  return data.rows;
}

/* listado minijuego */
export async function getGameProgress(gameId:string) {
  const { data } = await api.get<{ rows:GameRow[] }>(
    `/teacher/minigames/${gameId}`);
  return data.rows;
}

/* puntos & recompensas de toda la clase */
export async function getRewardsSummary() {
  const { data } = await api.get<{ rows:RewardRow[] }>(
    "/teacher/rewards");
  return data.rows;
}

/* reporte general (agrega lo que necesites) */
export async function getReports() {
  const { data } = await api.get<{
    kids:KidRow[];   // totales, medias, etc.
  }>("/teacher/reports");
  return data;
}
