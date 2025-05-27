import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Redirige según el estado de sesión.
 * Usa setTimeout(..., 0) para diferir la navegación hasta que
 * el Root Navigation esté listo (evita navigate-before-mount).
 */
export default function useAuthRedirect() {
  const router = useRouter();
  const segments: string[] = useSegments();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // 👉 En la primera renderización segments = [] → aún no hay rutas
    if (Array.isArray(segments) && segments.length === 0) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      setTimeout(() => router.replace("/(auth)/login"), 0);
    } else if (user && inAuthGroup) {
      console.log("user", user);
      if (user.role === "teacher") {
        setTimeout(() => router.replace("/(teacher)"), 0);
      } else {
        setTimeout(() => router.replace("/(tabs)"), 0);
      }
    }
  }, [user, segments]);
}
