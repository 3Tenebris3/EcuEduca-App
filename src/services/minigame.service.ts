import api from "@/api/client";

export interface MinigameResumeDTO {
  id:          string;
  title:       string;
  classId:     string;
  attempts:    number;  // nº de partidas registradas
  avgScore:    number;  // promedio 0-100
  total:       number;  // alumnos de la clase
}

export interface MinigameStudentDTO {
  studentId: string;
  name:      string;
  attempts:  number;
  bestScore: number;      // 0-100
}


export type MinigameResume   = MinigameResumeDTO;
export type MinigameStudent  = MinigameStudentDTO;

/* Lista resumida (opcional ?classId) */
export async function getMinigameResumes(classId?: string) {
  const { data } = await api.get<{ minigames: MinigameResume[] }>(
    "/teacher/minigames",
    { params: classId ? { classId } : undefined },
  );
  return data.minigames;
}

/* Detalle */
export async function getMinigameDetail(id: string, classId: string) {
  const { data } = await api.get<{
    meta: MinigameResume;
    students: MinigameStudent[];
  }>(`/teacher/minigames/${id}`, { params: { classId } });
  return data;
}
