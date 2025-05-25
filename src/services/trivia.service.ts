/* src/services/trivia.service.ts */
import api from "@/api/client";

/* ---------- tipos ---------- */
export interface TriviaQuestion {
  id:      string;
  text:    string;
  options: string[];
  answer:  string;
}

export interface TriviaSet {
  id:        string;
  title:     string;
  total:     number;  // nº de preguntas en set
  completed: boolean;
  lastScore?: number;
}

/* ---------- API calls ---------- */
export async function getTriviaSets(): Promise<TriviaSet[]> {
  const { data } = await api.get("/minigames/trivia/sets");
  return data.data.sets;
}

export async function getTriviaSet(setId: string | undefined): Promise<{ questions: TriviaQuestion[] }> {
  const { data } = await api.get(`/minigames/trivia/sets/${setId}`);
  return data.data;
}

export async function submitTrivia(setId: string | undefined, correct: number, total: number) {
  const { data } = await api.post(`/minigames/trivia/submit`, {
    setId, correct, total,
  });
  return data.data;               // { gained: number }
}
