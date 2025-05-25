import api from "../api/client";

/* tipos que llegan del backend */
export interface SeqItem {
  id: string;
  label: string;
  correctIndex: number;
}

export interface SeqSet {
  id: string;
  items: SeqItem[];
}

export async function getSequenceSet(setId: string) {
  const { data } = await api.get<SeqSet>(`/minigames/sequence/sets/${setId}`);
  return data;
}

export async function submitSequence(
  setId: string,
  correct: number,
  total: number,
) {
  const { data } = await api.post("/minigames/sequence/submit", {
    setId,
    correct,
    total,
  });
  return data.data as { gained: number };
}

export interface SeqSetSummary {
  id: string;
  title: string;
  completed: boolean;
}

/* ---------- lista para la pantalla ---------- */
export async function getSequenceSets() {
  const { data } = await api.get<SeqSetSummary[]>("/minigames/sequence/sets");
  return data;
}
