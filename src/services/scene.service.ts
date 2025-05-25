import api from "@/api/client";

/* ---------- Tipos que ya consumes en la lista ---------- */
export interface SceneMeta {
  id:        string;
  title:     string;
  preview:   string;   // miniatura URL (Storage / CDN)
  completed: boolean;
}

/* detalle que usa /scenarios/preview */
export interface SceneDetail extends SceneMeta {
  desc:      string;         // párrafos \n‐separados
  glbUrl:    string;         // modelo GLB público
  audioUrl?: string;         // narración opcional
}

/* ----------- peticiones ----------- */
export async function getScenes(): Promise<SceneMeta[]> {
  /* GET /scenarios → { scenes:[...] } */
  const { data } = await api.get("/scenarios");
  return data.data.scenes as SceneMeta[];
}

export async function getScene(id: string): Promise<SceneDetail> {
  /* GET /scenarios/:id → { scene:{...} } */
  const { data } = await api.get(`/scenarios/${id}`);
  return data.data.scene as SceneDetail;
}
