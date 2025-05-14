import { AttemptDoc, QuizDoc } from "@/types/quiz.types";


/* obtener un quiz completo (con preguntas) */
export async function getQuiz(quizId: string): Promise<QuizDoc> {
  try {
    return {
      id: quizId,
      title: "Cuestionario demo",
      durationSec: 60,
      maxAttempts: -1,
      questions: [
        {
          id: "q1",
          order: 1,
          type: "multiple_choice",
          questionText: "¿Cuál es la capital de Ecuador?",
          options: ["Lima", "Quito", "La Paz", "Bogotá"],
          correct: 1,
        },
        {
          id: "q2",
          order: 2,
          type: "true_false",
          questionText: "El Volcán Chimborazo es el punto más cercano al Sol.",
          options: [],
          correct: true,
        },
      ],
    };
    //const r = await api.get(`/quizzes/${quizId}`);
    //return r.data.data;
  } catch {
    /* mock de demo con 2 preguntas */
    return {
      id: quizId,
      title: "Cuestionario demo",
      durationSec: 60,
      maxAttempts: -1,
      questions: [
        {
          id: "q1",
          order: 1,
          type: "multiple_choice",
          questionText: "¿Cuál es la capital de Ecuador?",
          options: ["Lima", "Quito", "La Paz", "Bogotá"],
          correct: 1,
        },
        {
          id: "q2",
          order: 2,
          type: "true_false",
          questionText: "El Volcán Chimborazo es el punto más cercano al Sol.",
          options: [],
          correct: true,
        },
      ],
    };
  }
}

/* iniciar intento -> back devuelve AttemptDoc */
export async function startAttempt(
  quizId: string,
  userId: string
): Promise<AttemptDoc> {
  try {
    return {
      id: "a1",
      quizId,
      userId,
      startedAt: new Date(),
      answers: [],
    };
    //const r = await api.post("/quizzes/attempts", { quizId, userId });
    //return r.data.data;
  } catch {
    return {
      id: "a1",
      quizId,
      userId,
      startedAt: new Date(),
      answers: [],
    };
  }
}

/* enviar respuestas */
export async function submitAttempt(
  attemptId: string,
  answers: (number | boolean | string)[]
): Promise<{ score: number; maxScore: number }> {
  try {
    const max = answers.length;
    return { score: Math.round(max / 2), maxScore: max };
    //const r = await api.post(`/quizzes/attempts/${attemptId}/submit`, {
    //  answers,
    //});
    //return r.data.data;
  } catch {
    /* mock: 50 % aciertos */
    const max = answers.length;
    return { score: Math.round(max / 2), maxScore: max };
  }
}
