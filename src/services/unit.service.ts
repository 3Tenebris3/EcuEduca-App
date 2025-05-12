
export interface UnitDto {
  id: string;
  title: string;
  order: number;
}

export async function getUnits(groupId: string): Promise<UnitDto[]> {
  try {
    return [
      { id: "u-1", title: "Unidad 1 · Introducción", order: 1 },
      { id: "u-2", title: "Unidad 2 · Civilizaciones", order: 2 },
    ];
    //const { data } = await client.get(`/groups/${groupId}/units`);
    //return data.data as UnitDto[];
  } catch {
    return [
      { id: "u-1", title: "Unidad 1 · Introducción", order: 1 },
      { id: "u-2", title: "Unidad 2 · Civilizaciones", order: 2 },
    ];
  }
}