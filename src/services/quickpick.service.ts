import api from "../api/client";

/** Item que envía el backend */
export interface QPItem {
  id:   string;
  name?: string;      // sólo los “targets” tienen nombre
  imgUrl: string;     // URL absoluta (Firebase Storage, CDN, etc.)
}

/** Tema completo */
export interface QPTheme {
  id:          string;
  bg:          string;    // color de fondo (#RRGGBB)
  targets:     QPItem[];
  distractors: QPItem[];
}

/* ---------- obtener tema ---------- */
export async function getQuickPickTheme(setId: string): Promise<QPTheme> {
  const { data } = await api.get(`/minigames/quickpick/sets/${setId}`);
  return data as QPTheme;
}

/* ---------- enviar resultado ---------- */
export async function submitQuickPick(
  setId:      string,
  hits:       number,
  misses:     number
): Promise<{ gained: number }> {
  const { data } = await api.post("/minigames/quickpick/submit", {
    setId,
    hits,
    misses,
  });
  return data.data; // { gained }
}
