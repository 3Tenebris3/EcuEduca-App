export interface User {
    id: string;
    email: string;
    displayName: string;
    avatar?: string;
    phone?: string;
    role?: "student" | "teacher" | "admin" | "parent";
    teacherName?: string;
    classes?: string[];
  }
  