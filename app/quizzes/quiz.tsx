/* app/quizzes/quiz.tsx */
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  getQuizQuestions,
  QuizQuestion,
  submitQuiz,
} from "@/services/quiz.service";
import { usePointsStore } from "@/store/points";

export default function Quiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [idx, setIdx]             = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [answers, setAnswers]     = useState<number[]>([]);
  const [loading, setLoading]     = useState(true);

  const updatePoints = usePointsStore((s) => s.updatePoints);

  /* ---- fetch questions ---- */
  const load = useCallback(async () => {
    try {
      const data = await getQuizQuestions(id);
      setQuestions(data);
    } catch {
      Alert.alert("Error", "No se pudo cargar el cuestionario", [
        { text: "Volver", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => void load(), [load]);

  /* ---- interacción ---- */
  const choose = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
  };

  const next = async () => {
    if (selected === null) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);

    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
    } else {
      /* envía al backend y navega a resultado */
      try {
        const res = await submitQuiz(id, nextAnswers);
        updatePoints(res.gained);          // suma puntos en el store
        router.replace({
          pathname: "/quizzes/quiz-result",
          params: {
            score: String(res.score),
            total: String(res.total),
          },
        });
      } catch {
        Alert.alert("Error", "No se pudo enviar el cuestionario");
      }
    }
  };

  /* ---- estados UI ---- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: "#555" }}>
          No hay preguntas en este cuestionario.
        </Text>
      </View>
    );
  }

  const q = questions[idx];

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Animated.Text entering={FadeInDown.springify()} style={styles.counter}>
        Pregunta {idx + 1} de {questions.length}
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.springify().delay(100)}
        style={styles.question}
      >
        {q.prompt}
      </Animated.Text>

      {q.choices.map((opt, i) => {
        const correct   = selected !== null && i === q.answer;
        const wrongSel  = selected === i && i !== q.answer;
        const bg        = selected === null
          ? "#FFFDE7"
          : correct   ? "#C8E6C9"
          : wrongSel  ? "#FFCDD2"
          : "#FFFDE7";

        return (
          <Animated.View key={i} entering={FadeInDown.delay(150 + i * 40)}>
            <TouchableOpacity
              style={[styles.option, { backgroundColor: bg }]}
              onPress={() => choose(i)}
              disabled={selected !== null}
            >
              <Text style={styles.optText}>{opt}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {selected !== null && (
        <TouchableOpacity style={styles.nextBtn} onPress={next}>
          <Text style={styles.nextTxt}>
            {idx === questions.length - 1 ? "Ver resultado" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* ---- styles ---- */
const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#FFFBE6", minHeight: "100%" },
  center:  { flex: 1, justifyContent: "center", alignItems: "center" },
  counter: { fontSize: 18, color: "#6D4C41", marginBottom: 12 },
  question:{ fontSize: 22, fontWeight: "600", color: "#37474F", marginBottom: 20 },
  option:  {
    padding: 14, borderRadius: 14, marginBottom: 12,
    borderWidth: 1, borderColor: "#eee",
  },
  optText: { fontSize: 18, color: "#424242" },
  nextBtn: {
    marginTop: 24, backgroundColor: "#2196F3",
    padding: 14, borderRadius: 16, alignItems: "center",
  },
  nextTxt: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
