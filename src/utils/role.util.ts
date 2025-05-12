// src/utils/role.util.ts
export function roleToSpanish(role: string | string[]) {
  const r = Array.isArray(role) ? role[0] : role;
  switch (r) {
    case "student":
      return "Estudiante";
    case "teacher":
      return "Profesor";
    case "admin":
      return "Administrador";
    default:
      return r ?? "—";
  }
}
