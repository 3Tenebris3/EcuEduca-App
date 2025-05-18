import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const QUIZZES = [
  { id: "quiz_egypt",  title: "Egipto Antiguo",  completed: false },
  { id: "quiz_rome",   title: "Imperio Romano", completed: true  },
  { id: "quiz_middle", title: "Edad Media",     completed: false },
];

export default function QuizList() {
  const go = (q: typeof QUIZZES[0]) => {
    if (q.completed) {
      router.push({
        pathname: "/quizzes/quiz-result",
        params: { score: "4", total: "5" },          // mock for completed items
      });
    } else {
      router.push({ pathname: "/quizzes/quiz", params: { id: q.id } });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.title}>Elige tu cuestionario 📚</Text>

      {QUIZZES.map((q, idx) => (
        <Animated.View
          entering={FadeInDown.delay(idx * 80)}
          key={q.id}
          style={[
            styles.card,
            { backgroundColor: q.completed ? "#C8E6C9" : "#BBDEFB" },
          ]}
        >
          <TouchableOpacity onPress={() => go(q)}>
            <Text style={styles.label}>{q.title}</Text>
            <Text style={styles.status}>
              {q.completed ? "✅ Completado" : "⏳ Pendiente"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#E3F2FD", minHeight: "100%" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#0D47A1" },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: { fontSize: 18, fontWeight: "600", color: "#0D47A1" },
  status: { marginTop: 8, fontSize: 14, color: "#08306B" },
});
