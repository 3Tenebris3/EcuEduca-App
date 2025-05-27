import { saveMinigameProgress } from "@/services/progress.service";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuickPickResult() {
  const { hits, misses, id } = useLocalSearchParams<{
    hits: string;
    misses: string;
    id: string;
  }>();
  const h = parseInt(hits || "0", 10);
  const m = parseInt(misses || "0", 10);

  const score = Number(hits) - Number(misses);

  /* ── registra avance SOLO una vez ── */
  useEffect(() => {
    saveMinigameProgress(id, score).catch(console.error);
  }, []);

  const ratio = h + m ? h / (h + m) : 0;
  const msg =
    ratio === 1
      ? "¡Reflejos perfectos! ⚡️"
      : ratio >= 0.7
      ? "¡Genial velocidad! 🚀"
      : ratio >= 0.5
      ? "¡Buen intento! 💪"
      : "¡Sigue practicando! 🙌";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Resultados 🚀</Text>
      <Text style={styles.msg}>{msg}</Text>
      <Text style={styles.score}>
        Aciertos: {h}
        {"\n"}Errores: {m}
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace("/minigames")}
      >
        <Text style={styles.btnText}>Volver a minijuegos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#EF6C00",
    marginBottom: 12,
  },
  msg: {
    fontSize: 20,
    color: "#E65100",
    marginBottom: 24,
    textAlign: "center",
  },
  score: {
    fontSize: 18,
    color: "#5D4037",
    marginBottom: 32,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#FB8C00",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
