import api from "../api/client";

/* --- tipos del backend --- */
export type MemoryPair = {
  id: string;
  name: string;
  imgUrl: string;              // url absoluta
};

export type MemorySet = {
  id: string;
  title: string;
  total: number;
  moves?: number;              // si el usuario ya lo jugó
};

/* lista de sets + mis puntuaciones -------------------------------------- */
export async function listMemorySets(): Promise<{
  sets: MemorySet[];
  scores: Record<string, { moves: number; pairs: number }>;
}> {
  const { data } = await api.get("/minigames/memory/sets");
  return data as any;
}

/* pares de un set -------------------------------------------------------- */
export async function getMemoryPairs(setId: string): Promise<MemoryPair[]> {
  const { data } = await api.get(`/minigames/memory/sets/${setId}`);
  return data as any;
}

/* envío del resultado ---------------------------------------------------- */
export async function submitMemory(
  setId: string,
  moves: number
): Promise<{ gained: number }> {
  const { data } = await api.post("/minigames/memory/submit", { setId, moves });
  return data.data;
}
