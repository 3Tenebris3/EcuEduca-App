import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MemoryResult() {
  const { moves, pairs } = useLocalSearchParams<{ moves: string; pairs: string }>();
  const mv = parseInt(moves || "0", 10);
  const pr = parseInt(pairs || "0", 10);

  const message =
    mv <= pr * 2
      ? "¡Memoria prodigiosa! 🧠✨"
      : mv <= pr * 3
      ? "¡Muy bien! 🎉"
      : "¡Buen esfuerzo! 💪";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 ¡Juego completado! 🎉</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.statsBox}>
        <FontAwesome name="check-circle" size={30} color="#66BB6A" />
        <Text style={styles.statsText}>
          Pares totales: {pr}{"\n"}Movimientos: {mv}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/minigames")}
      >
        <Text style={styles.buttonText}>Volver a minijuegos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAF6",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#3F51B5", marginBottom: 12 },
  message: { fontSize: 20, color: "#303F9F", marginBottom: 24, textAlign: "center" },
  statsBox: {
    flexDirection: "row",
    backgroundColor: "#C5CAE9",
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    alignItems: "center",
  },
  statsText: { marginLeft: 12, fontSize: 16, color: "#1A237E" },
  button: {
    backgroundColor: "#5C6BC0",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
