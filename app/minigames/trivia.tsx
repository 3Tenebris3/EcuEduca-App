import { router } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

const sampleQuestions = [
  {
    question: "¿Cuál es el planeta más grande del sistema solar?",
    options: ["Tierra", "Júpiter", "Saturno", "Venus"],
    correctAnswer: "Júpiter",
  },
  {
    question: "¿Cuántas patas tiene una araña?",
    options: ["6", "8", "10", "4"],
    correctAnswer: "8",
  },
  {
    question: "¿Cuál es el resultado de 9 x 3?",
    options: ["18", "27", "36", "21"],
    correctAnswer: "27",
  },
];

const TriviaGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = sampleQuestions[currentIndex];

  const handleOptionPress = (option: string) => {
    if (showAnswer) return;

    setSelectedOption(option);
    setShowAnswer(true);

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);

    if (currentIndex < sampleQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.replace({
        pathname: "/minigames/trivia-result",
        params: { score: score.toString(), total: sampleQuestions.length.toString() },
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Trivia 🧠</Text>
      <Text style={styles.subtitle}>Pregunta {currentIndex + 1} de {sampleQuestions.length}</Text>

      <Text style={styles.question}>{currentQuestion.question}</Text>

      {currentQuestion.options.map((option, index) => {
        const isCorrect = option === currentQuestion.correctAnswer;
        const isSelected = option === selectedOption;
        const backgroundColor =
          showAnswer && isSelected
            ? isCorrect
              ? "#4CAF50"
              : "#F44336"
            : "#fff";

        return (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, { backgroundColor }]}
            onPress={() => handleOptionPress(option)}
            disabled={showAnswer}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}

      {showAnswer && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex === sampleQuestions.length - 1 ? "Ver resultado" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default TriviaGame;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFDE7",
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 16,
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#444",
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  nextButton: {
    marginTop: 24,
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
