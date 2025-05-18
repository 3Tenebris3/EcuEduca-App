import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const TriviaResultScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
  const { score, total } = useLocalSearchParams<{ score: string; total: string }>();
  const numericScore = parseInt(score || "0", 10);
  const numericTotal = parseInt(total || "1", 10);

  const getMessage = () => {
    const ratio = numericScore / numericTotal;
    if (ratio === 1) return "¡Excelente! 🌟";
    if (ratio >= 0.7) return "¡Muy bien! 🎉";
    if (ratio >= 0.5) return "¡Buen intento! 💪";
    return "¡Puedes hacerlo mejor! 🙌";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎊 Resultados 🎊</Text>
      <Text style={styles.message}>{getMessage()}</Text>
      <View style={styles.starsContainer}>
        {[...Array(numericScore)].map((_, i) => (
          <FontAwesome key={i} name="star" size={30} color="#FFD700" />
        ))}
        {[...Array(numericTotal - numericScore)].map((_, i) => (
          <FontAwesome key={i} name="star-o" size={30} color="#CCC" />
        ))}
      </View>
      <Text style={styles.scoreText}>
        Obtuviste {numericScore} de {numericTotal} puntos.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/minigames")}
      >
        <Text style={styles.buttonText}>Volver a minijuegos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TriviaResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E5F5",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6A1B9A",
    marginBottom: 16,
  },
  message: {
    fontSize: 22,
    color: "#333",
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 18,
    color: "#444",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#8E24AA",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
