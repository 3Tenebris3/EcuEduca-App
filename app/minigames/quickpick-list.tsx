import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const games = [
  { id: "qp1", title: "Frutas", completed: false },
  { id: "qp2", title: "Animales", completed: true },
  { id: "qp3", title: "Figuras geométricas", completed: false },
];

export default function QuickPickList() {
  const go = (g: { id: string; completed: boolean }) => {
    if (g.completed) {
      router.push({ pathname: "/minigames/quickpick-result", params: { hits: "8", misses: "2" } });
    } else {
      router.push({ pathname: "/minigames/quickpick", params: { id: g.id } });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Elige un reto ⚡️</Text>

      {games.map((g) => (
        <TouchableOpacity
          key={g.id}
          style={[styles.card, { backgroundColor: g.completed ? "#C8E6C9" : "#FFE0B2" }]}
          onPress={() => go(g)}
        >
          <Text style={styles.cardText}>{g.title}</Text>
          <Text style={styles.status}>{g.completed ? "✅ Completado" : "⏳ Pendiente"}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#FFF8E1", minHeight: "100%" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#444" },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: { fontSize: 18, fontWeight: "600", color: "#333" },
  status: { marginTop: 8, fontSize: 14, color: "#666" },
});
