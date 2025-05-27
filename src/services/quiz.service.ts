/* src/services/quiz.service.ts */
import api from "../api/client";

export type QuizMeta = {
  id: string;
  title: string;
  total: number;
  completed: boolean;
  score: number;
};

/* ---------- LISTA DE QUIZZES ---------- */
export async function fetchQuizList(): Promise<QuizMeta[]> {
  /**
   * El backend responde:
   * { success, code, message, data:{ sets:[…], scores:{…} } }
   */
  const res = await api.get<{
    success: boolean;
    data: {
      sets:   { id: string; title: string; total: number }[];
      scores: Record<string, { score: number; total: number }>;
    };
  }>("/quizzes/sets");

  const { sets, scores } = res.data.data;   //  ←  CORREGIDO

  return sets.map((s) => {
    const sc = scores[s.id];
    return {
      id: s.id,
      title: s.title,
      total: s.total,
      completed: !!sc,
      score: sc ? sc.score : 0,
    };
  });
}

/* ---------- PREGUNTAS (sin respuestas) ---------- */
export async function getQuizQuestions(id: string) {
  const res = await api.get("/quizzes/sets/" + id);
  return res.data.data as {
    id: string;
    prompt: string;
    choices: string[];
  }[];
}

/* ---------- ENVIAR RESPUESTAS ---------- */
export async function submitQuiz(quizId: string, answers: number[]) {
  const res = await api.post("/quizzes/submit", { quizId, answers });
  return res.data.data as { score: number; total: number; gained: number };
}
