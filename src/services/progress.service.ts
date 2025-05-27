/* src/services/progress.service.ts */
import api from "@/api/client";

/* ------------- tipado común ------------- */
type Activity =
  | { type: "scenario"; id: string }                       // solo id
  | { type: "minigame"; id: string; points: number }       // + pts
  | { type: "quiz";     id: string; score: number }        // + score / total
  | { type: "sequence"; id: string; points: number }
  | { type: "quickpick";id: string; points: number };

function postProgress(payload: Activity) {
  return api.post("/progress", payload);   // JWT ya se añade por interceptor
}

/* ------------- helpers de conveniencia ------------- */
export const saveScenarioProgress  = (scenarioId: string) =>
  postProgress({ type: "scenario", id: scenarioId });

export const saveMinigameProgress = (
  gameId: string,
  points: number,
) => postProgress({ type: "minigame", id: gameId, points });

export const saveSequenceProgress = (
  seqId: string,
  points: number,
) => postProgress({ type: "sequence", id: seqId, points });

export const saveQuickPickProgress = (
  qpId: string,
  points: number,
) => postProgress({ type: "quickpick", id: qpId, points });

export const saveQuizProgress = (
  quizId: string,
  score: number,
) => postProgress({ type: "quiz", id: quizId, score });

/* ============================================================
 * BLOQUE EXCLUSIVO PARA PROFESOR
 * ============================================================
 */

/** estructura que devuelve GET /teacher/progress?classId=... */
export interface ClassProgress {
  studentId : string;
  student   : string;          // nombre
  avatar    : string;
  // --- totales ---
  scenarios : number;          // completados
  minigames : number;
  quizzes   : number;
  points    : number;
}

/**
 *  🠕  Lista el progreso agregado de una clase completa
 *  Ej: /teacher/progress?classId=abc123
 */
export async function getClassProgress(classId: string) {
  const { data } = await api.get(`/teacher/progress`, {
    params: { classId },
  });
  return data.data as ClassProgress[];
}
