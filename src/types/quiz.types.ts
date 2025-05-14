/* Tipos que usa el front para el flujo de cuestionarios ---------- */

export interface QuizDoc {
  id: string;
  title: string;
  durationSec: number;          // tiempo total
  maxAttempts: number;          // -1 = ilimitado
  description?: string;
  questions: QuestionDoc[];     // simplificado, el back los puede traer aparte
}

export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

export interface QuestionDoc {
  id: string;
  order: number;
  type: QuestionType;
  questionText: string;
  options: string[];            // solo multiple_choice
  correct: number | boolean | string;
}

export interface AttemptDoc {
  id: string;
  quizId: string;
  userId: string;
  startedAt: Date;
  finishedAt?: Date;
  answers: (number | boolean | string)[];
  score?: number;
  maxScore?: number;
  finishedBy?: "submit" | "timeout";
}
