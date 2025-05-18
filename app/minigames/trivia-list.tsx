import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const triviaList = [
  { id: "trivia1", title: "Trivia de Animales", completed: false },
  { id: "trivia2", title: "Trivia del Espacio", completed: true },
  { id: "trivia3", title: "Trivia de Historia", completed: false },
];

const TriviaListScreen = () => {
  const handlePress = (trivia: { id: string; completed: boolean }) => {
    if (trivia.completed) {
      router.push({
        pathname: "/minigames/trivia-result",
        params: { score: "3", total: "5" }, // ← Mock hasta conectar con datos reales
      });
    } else {
      router.push({
        pathname: "/minigames/trivia",
        params: { id: trivia.id },
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Elige una Trivia 🧠</Text>

      {triviaList.map((trivia, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            { backgroundColor: trivia.completed ? "#C8E6C9" : "#FFECB3" },
          ]}
          onPress={() => handlePress(trivia)}
        >
          <Text style={styles.cardText}>{trivia.title}</Text>
          <Text style={styles.status}>
            {trivia.completed ? "✅ Completada" : "⏳ Pendiente"}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default TriviaListScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF8E1",
    minHeight: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#444",
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  status: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
});
