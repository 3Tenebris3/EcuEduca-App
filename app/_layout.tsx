// app/_layout.tsx
import { colors } from "@/theme/colors";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useAuthRedirect from "../src/navigation/useAuthRedirect";

export default function RootLayout() {
  useAuthRedirect(); // ← sigue funcionando

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
        <Slot /> 
      </SafeAreaView>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
