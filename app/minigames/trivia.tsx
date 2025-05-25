/* app/minigames/trivia.tsx */
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getTriviaSet,
  submitTrivia,
  TriviaQuestion,
} from "@/services/trivia.service";
import { usePointsStore } from "@/store/points";

export default function TriviaGame() {
  const { id } = useLocalSearchParams<{ id: string }>();      // ← setId
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [idx,    setIdx]    = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);  // ← renamed
  const [show,   setShow]   = useState(false);
  const [score,  setScore]  = useState(0);
  const [loading, setLoading] = useState(true);

  const updatePoints = usePointsStore((s) => s.updatePoints);

  /* ───── cargar set ───── */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const set = await getTriviaSet(id);
        if (active) setQuestions(set.questions);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const q = questions[idx];

  /* ───── opción tap ───── */
  const choose = (opt: string) => {
    if (show) return;
    setChosen(opt);
    setShow(true);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  /* ───── siguiente / fin ───── */
  const next = async () => {
    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
      setChosen(null);
      setShow(false);
    } else {
      let gained = 0;
      try {
        const res = await submitTrivia(id, score, questions.length);
        gained = res.gained;
        updatePoints(gained);
      } catch {
        /* ignore – resultado seguirá mostrando score */
      }
      router.replace({
        pathname: "/minigames/trivia-result",
        params: {
          score:  String(score),
          total:  String(questions.length),
          gained: String(gained),
        },
      });
    }
  };

  /* ───── UI ───── */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Trivia 🧠</Text>
      <Text style={styles.subtitle}>
        Pregunta {idx + 1} de {questions.length}
      </Text>

      <Text style={styles.question}>{q.text}</Text>

      {q.options.map((opt) => {
        const correct    = opt === q.answer;
        const isSelected = opt === chosen;
        const bg =
          show && isSelected
            ? correct
              ? "#4CAF50"
              : "#F44336"
            : "#fff";

        return (
          <TouchableOpacity
            key={opt}
            style={[styles.optionButton, { backgroundColor: bg }]}
            onPress={() => choose(opt)}
            disabled={show}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        );
      })}

      {show && (
        <TouchableOpacity style={styles.nextButton} onPress={next}>
          <Text style={styles.nextText}>
            {idx === questions.length - 1 ? "Ver resultado" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* ───── styles ───── */
const styles = StyleSheet.create({
  center:   { flex: 1, justifyContent: "center", alignItems: "center" },

  container:{ padding: 16, backgroundColor: "#FFFDE7", minHeight: "100%" },
  title:    { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 8 },
  subtitle: { fontSize: 18, color: "#555", marginBottom: 16 },
  question: { fontSize: 20, fontWeight: "600", marginBottom: 16, color: "#444" },

  optionButton:{
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionText:{ fontSize: 16, color: "#333" },

  nextButton:{
    marginTop: 24,
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextText:{ color: "#fff", fontSize: 16, fontWeight: "bold" },
});
