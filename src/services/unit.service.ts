
/* --- DTOs que ya usabas --- */
export interface UnitDto {
  id: string;
  order: number;
  title: string;
}

/* --- listado de unidades ------------------------------------ */
export async function getUnits(groupId: string): Promise<UnitDto[]> {
  try {
    return [
      { id: "u1", order: 1, title: "Introducción" },
      { id: "u2", order: 2, title: "Civilizaciones" },
    ];
    //const r = await api.get(`/groups/${groupId}/units`);
    //return r.data.data;                // ← back real
  } catch {
    /* mock de 2 unidades */
    return [
      { id: "u1", order: 1, title: "Introducción" },
      { id: "u2", order: 2, title: "Civilizaciones" },
    ];
  }
}

/* --- qué recursos hay en la unidad --------------------------- */
export async function getUnitResources(unitId: string): Promise<{
  ra: boolean;
  mini: boolean;
  quiz: boolean;
}> {
  try {
    return { ra: true, mini: true, quiz: true }; // mock: todo activo
    //const r = await api.get(`/units/${unitId}/resources`);
    //return r.data.data;                // ← { ra:true, mini:false, quiz:true }
  } catch {
    return { ra: true, mini: true, quiz: true }; // mock: todo activo
  }
}
