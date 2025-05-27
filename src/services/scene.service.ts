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

// src/services/scene.service.ts
export async function getScene(id: string): Promise<SceneDetail> {
  const { data } = await api.get(`/scenarios/${id}`);
  return (data.data.scene ?? data.data) as SceneDetail; // ← usa cualquiera
}

/** Escenarios que el profe puede consultar */
export interface TeacherSceneMeta {
  id:    string;
  title: string;
}

/** Una fila de la tabla de progreso */
export interface SceneStudentRow {
  studentId: string;
  name:      string;
  times:     number;         // 0 → nunca abierto
}

export async function getSceneProgress(
  classId: string,
  sceneId: string
) {
  const { data } = await api.get<{ rows: SceneStudentRow[] }>(
    `/teacher/classes/${classId}/scenarios/${sceneId}`
  );
  return data.rows;
}

export interface SceneResume {
  id:        string;
  title:     string;
  classId:   string;
  completed: number;   // alumnos que ya lo terminaron
  total:     number;   // alumnos de la clase
}

export interface SceneStudent {
  studentId: string;
  name:      string;
  done:      boolean;
}


// GET /teacher/scenarios/:id   → { meta, students[] }
export async function getSceneDetail(sceneId: string) {
  const { data } = await api.get<{
    meta:      SceneResume;
    students:  SceneStudent[];
  }>(`/teacher/scenarios/${sceneId}`);

  return data;
}

export async function getTeacherScenes() {
  const { data } = await api.get<{ scenes: SceneResume[] }>(
    "/teacher/scenarios"
  );
  return data.scenes;
}