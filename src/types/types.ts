export interface AttemptDoc {
  id: string;
  quizId: string;
  userId: string;
  answers: (number | null)[];
  startedAt: string;          // ISO date desde el backend
  finishedAt?: string;
  score?: number;
  maxScore?: number;
  finishedBy?: "submit" | "timeout";
}

export interface SubmitQuizDTO {
  quizId: string;
  attemptId: string;
  answers: (number | null)[];
  timeout?: boolean;
}
