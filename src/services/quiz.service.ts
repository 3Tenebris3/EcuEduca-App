import api from "../api/client";

export type QuizMeta = {
  id: string;
  title: string;
  total: number;      // número de preguntas
  completed: boolean;
  score: number;      // aciertos (si completed)
};

export async function fetchQuizList(): Promise<QuizMeta[]> {
  /* Backend responde:
     { sets:[{id,title,total}], scores:{ quizId:{score,total} } } */
  const { data } = await api.get<{
    sets:   { id: string; title: string; total: number }[];
    scores: Record<string, { score: number; total: number }>;
  }>("/quizzes/sets");

  return data.sets.map((s) => {
    const sc = data.scores[s.id];
    return {
      id: s.id,
      title: s.title,
      total: s.total,
      completed: !!sc,
      score: sc ? sc.score : 0,
    };
  });
}

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;    // solo para validación local si quisieras
};

export async function getQuizQuestions(id: string): Promise<QuizQuestion[]> {
  const { data } = await api.get<QuizQuestion[]>(`/quizzes/sets/${id}`);
  return data;
}

export async function submitQuiz(
  quizId: string,
  answers: number[]
): Promise<{ score: number; total: number; gained: number }> {
  const { data } = await api.post("/quizzes/submit", { quizId, answers });
  return data.data;           // según createResponse
}
