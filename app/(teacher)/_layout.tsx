import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "expo-router";

export default function TeacherLayout() {
  const { user } = useAuthStore();           // ← nombre del profesor

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },   // blanco, sin banda verde
        headerShadowVisible: false,
        headerTintColor: "#37474F",
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        headerTitle: `Hola, ${user?.displayName ?? "Profe"} 👋`,
      }}
    >
      <Stack.Screen name="index" options={{ title: "" }} />
    </Stack>
  );
}
