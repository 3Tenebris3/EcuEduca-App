import { usePointsStore } from "@/store/points";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

/* ── Banco de preguntas ── */
type Q = { question: string; options: string[]; answer: string };

const BANK: Record<string, Q[]> = {
  quiz_egypt: [
    { question: "¿Cuál es la pirámide más alta?", options: ["Micerinos", "Keops", "Saqqara", "Dashur"], answer: "Keops" },
    { question: "El dios con cabeza de halcón es ___", options: ["Ra", "Anubis", "Horus", "Osiris"], answer: "Horus" },
  ],
  quiz_rome: [
    { question: "Roma fue fundada en el año ___ a.C.", options: ["509", "753", "476", "30"], answer: "753" },
    { question: "La moneda de plata romana era el ___", options: ["Dólar", "Denario", "Sestercio", "Aureo"], answer: "Denario" },
  ],
  quiz_middle: [
    { question: "¿En qué año fue la caída de Constantinopla?", options: ["1453", "1492", "1215", "1066"], answer: "1453" },
  ],
};

export default function Quiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const questions = BANK[id] || [];

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const addPoints = usePointsStore((s) => s.addPoints);

  const q = questions[idx];

  const choose = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
    } else {
      addPoints(score * 5); // 5 pts por acierto
      router.replace({
        pathname: "/quizzes/quiz-result",
        params: { score: score.toString(), total: questions.length.toString() },
      });
    }
  };

  /* animación de entrada al cambiar idx */
  useEffect(() => setSelected(null), [idx]);

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Animated.Text
        entering={FadeInDown.springify()}
        style={styles.counter}
      >
        Pregunta {idx + 1} de {questions.length}
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.springify().delay(100)}
        style={styles.question}
      >
        {q.question}
      </Animated.Text>

      {q.options.map((opt, i) => {
        const correct = selected && opt === q.answer;
        const wrongSel = selected === opt && opt !== q.answer;
        const bg =
          !selected
            ? "#FFFDE7"
            : correct
            ? "#C8E6C9"
            : wrongSel
            ? "#FFCDD2"
            : "#FFFDE7";

        return (
          <Animated.View
            key={opt}
            entering={FadeInDown.delay(150 + i * 40)}
          >
            <TouchableOpacity
              style={[styles.option, { backgroundColor: bg }]}
              onPress={() => choose(opt)}
              disabled={!!selected}
            >
              <Text style={styles.optText}>{opt}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {selected && (
        <TouchableOpacity style={styles.nextBtn} onPress={next}>
          <Text style={styles.nextTxt}>
            {idx === questions.length - 1 ? "Ver resultado" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#FFFBE6", minHeight: "100%" },
  counter: { fontSize: 18, color: "#6D4C41", marginBottom: 12 },
  question: { fontSize: 22, fontWeight: "600", color: "#37474F", marginBottom: 20 },
  option: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  optText: { fontSize: 18, color: "#424242" },
  nextBtn: {
    marginTop: 24,
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  nextTxt: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
