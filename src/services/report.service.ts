/* src/services/teacher/report.service.ts */
import api from "@/api/client";

export async function getSummary(classId: string) {
  const { data } = await api.get("/teacher/reports/summary", { params:{ classId }});
  return data.data.summary;
}

export async function getStudents(classId: string) {
  const { data } = await api.get("/teacher/reports/students", { params:{ classId }});
  return data.data.students;
}
