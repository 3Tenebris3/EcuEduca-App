
/** tipos de módulo tal como definimos en el backend */
export type ModuleType = "3d" | "minigame" | "quiz";

export interface ModuleDto {
  id: string;
  type: ModuleType;
  title: string;
  refId: string;          // id en /scenarios, /minigames, /quizzes
  order: number;
}

/** devuelve todos los módulos de una unidad */
export async function getModules(classId: string, unitId: string) {
  try {
    return [
      { id: "m1", type: "3d",       title: "Pirámide 3D",       refId: "scn-1", order: 1 },
      { id: "m2", type: "minigame", title: "Puzzle jeroglífos", refId: "mg-7",  order: 2 },
      { id: "m3", type: "quiz", title: "Quiz Jeroglífos", refId: "qz-1",  order: 3 },
      /* no quiz → no se devuelve */
    ] as ModuleDto[];
    //const { data } = await api.get<{ data: ModuleDto[] }>(
    //  `/classes/${classId}/units/${unitId}/modules`
    //);
    //return data.data;
  } catch {
    /* ---------- mock / fallback ---------- */
    return [
      { id: "m1", type: "3d",       title: "Pirámide 3D",       refId: "scn-1", order: 1 },
      { id: "m2", type: "minigame", title: "Puzzle jeroglífos", refId: "mg-7",  order: 2 },
      { id: "m3", type: "quiz", title: "Quiz Jeroglífos", refId: "qz-1",  order: 3 },
      /* no quiz → no se devuelve */
    ] as ModuleDto[];
  }
}
