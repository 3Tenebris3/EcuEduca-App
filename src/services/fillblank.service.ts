import api from "../api/client";

export type FBQuestion = {
  id: string;
  prompt: string;           // frase con “___”
  choices: string[];
  answer: number;           // índice correcto (0-3)
};

/* preguntas de un set */
export async function getFBQuestions(setId: string) {
  const { data } = await api.get<FBQuestion[]>(
    `/minigames/fillblank/sets/${setId}`
  );
  return data;
}

/* envía respuestas y recibe puntuación + puntos ganados */
export async function submitFB(
  setId: string,
  answers: number[]
): Promise<{ score: number; total: number; gained: number }> {
  const { data } = await api.post("/minigames/fillblank/submit", {
    setId,
    answers,
  });
  return data.data;
}

/* Metadatos para la lista */
export type FBSetMeta = {
  id: string;
  title: string;
  total: number;
  completed: boolean;
  score: number;     // aciertos si completed
};

/* lista de sets + puntuaciones del usuario */
export async function listFBsets(): Promise<FBSetMeta[]> {
  /*
     Respuesta del backend:
     { sets:[{id,title,total}],
       scores:{ fb1:{score,total}, fb2:{score,total} } }
  */
  const { data } = await api.get<{
    sets:   { id: string; title: string; total: number }[];
    scores: Record<string, { score: number; total: number }>;
  }>("/minigames/fillblank/sets");

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