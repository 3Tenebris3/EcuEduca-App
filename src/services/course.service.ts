
export interface CourseDto {
  id: string;
  name: string;
  icon?: string;
  groups?: number;           // solo profe
}

export async function getMyCourses(): Promise<CourseDto[]> {
  try {
    //const { data } = await client.get("/courses");
    //return data.data as CourseDto[];
    return [
      { id: "hist-101", name: "Historia",     icon: "history.png" },
      { id: "math-101", name: "Matemáticas",  icon: "math.png"    },
    ];
  } catch {
    // ── mock ↓
    return [
      { id: "hist-101", name: "Historia",     icon: "history.png" },
      { id: "math-101", name: "Matemáticas",  icon: "math.png"    },
    ];
  }
}