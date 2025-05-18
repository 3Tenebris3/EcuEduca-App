import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const boards = [
  { id: "memory1", title: "Memorama de Animales", completed: false },
  { id: "memory2", title: "Memorama de Frutas", completed: true },
  { id: "memory3", title: "Memorama del Espacio", completed: false },
];

const MemoryListScreen = () => {
  const handlePress = (board: { id: string; completed: boolean }) => {
    if (board.completed) {
      router.push({
        pathname: "/minigames/memory-result",
        params: { moves: "22", pairs: "6" }, // mock temporal
      });
    } else {
      router.push({
        pathname: "/minigames/memory",
        params: { id: board.id },
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Elige un Memorama 🃏</Text>

      {boards.map((b) => (
        <TouchableOpacity
          key={b.id}
          style={[
            styles.card,
            { backgroundColor: b.completed ? "#C8E6C9" : "#FFECB3" },
          ]}
          onPress={() => handlePress(b)}
        >
          <Text style={styles.cardText}>{b.title}</Text>
          <Text style={styles.status}>
            {b.completed ? "✅ Completado" : "⏳ Pendiente"}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default MemoryListScreen;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#FFF8E1", minHeight: "100%" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#444" },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: { fontSize: 18, fontWeight: "600", color: "#333" },
  status: { marginTop: 8, fontSize: 14, color: "#666" },
});
