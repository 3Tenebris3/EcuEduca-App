/* src/services/attempt.service.ts */
import api from "@/api/client";
import { AttemptDoc, SubmitQuizDTO } from "@/types/types";

/* ─ util para generar mocks ─ */
function mockAttempt(partial: Partial<AttemptDoc> = {}): AttemptDoc {
  return {
    id:        "mock-att-1",
    quizId:    partial.quizId  ?? "mock-quiz",
    userId:    partial.userId  ?? "mock-user",
    startedAt: partial.startedAt ?? new Date().toISOString(),
    answers:   [],
    ...partial,
  };
}

/* ---------------- iniciar / retomar intento ---------------- */
export async function startAttempt(payload: {
  quizId: string;
  userId: string;
}): Promise<AttemptDoc> {
  try {
    const { data } = await api.post<AttemptDoc>(
      `/quizzes/${payload.quizId}/attempts`,
      { userId: payload.userId }
    );
    return data;
  } catch (_) {
    /* ← backend caído o sin datos → mock */
    return mockAttempt({ quizId: payload.quizId, userId: payload.userId });
  }
}

/* ---------------- enviar intento ---------------- */
export async function submitAttempt(
  body: SubmitQuizDTO
): Promise<{ score: number; maxScore: number; expired: boolean }> {
  try {
    const { data } = await api.post<{
      score: number;
      maxScore: number;
      expired: boolean;
    }>(`/quizzes/${body.quizId}/attempts/${body.attemptId}/submit`, body);

    return data;
  } catch (_) {
    /* mock – 50 % de aciertos */
    const mockMax = body.answers.length || 10;
    return { score: Math.floor(mockMax / 2), maxScore: mockMax, expired: false };
  }
}

/* opcional: historial ------------------------------------------------------- */
export async function getMyAttempts(quizId: string, userId: string) {
  try {
    const { data } = await api.get<AttemptDoc[]>(
      `/quizzes/${quizId}/attempts?userId=${userId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return [mockAttempt({ quizId, userId, finishedAt: new Date().toISOString(), score: 5, maxScore: 10 })];
  }
}
