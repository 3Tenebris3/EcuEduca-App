import {
  FBQuestion,
  getFBQuestions,
  submitFB,
} from "@/services/fillblank.service";
import { usePointsStore } from "@/store/points";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function FillBlank() {
  const { id } = useLocalSearchParams<{ id: string }>();

  /* ---- estado ---- */
  const [questions, setQuestions] = useState<FBQuestion[]>([]);
  const [idx, setIdx]             = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [answers, setAnswers]     = useState<number[]>([]);
  const [loading, setLoading]     = useState(true);

  const updatePoints = usePointsStore((s) => s.updatePoints);

  /* ---- anim refs ---- */
  const sentenceAnim    = useRef(new Animated.Value(-50)).current;
  const sentenceOpacity = useRef(new Animated.Value(0)).current;
  const optionsAnim     = useRef<Animated.Value[]>([]).current;

  /* ---- carga de preguntas ---- */
  const load = useCallback(async () => {
    try {
      const data = await getFBQuestions(id);
      setQuestions(data);
    } catch {
      Alert.alert("Error", "No se pudo cargar el minijuego", [
        { text: "Volver", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => void load(), [load]);

  /* ---- animación al cambiar de pregunta ---- */
  useEffect(() => {
    const optCount = questions[idx]?.choices.length ?? 0;
    optionsAnim.length = 0;
    for (let i = 0; i < optCount; i++) optionsAnim.push(new Animated.Value(0));

    sentenceAnim.setValue(-50);
    sentenceOpacity.setValue(0);
    optionsAnim.forEach((v) => v.setValue(0));

    Animated.sequence([
      Animated.parallel([
        Animated.timing(sentenceAnim, {
          toValue: 0, duration: 450, useNativeDriver: true,
        }),
        Animated.timing(sentenceOpacity, {
          toValue: 1, duration: 450, useNativeDriver: true,
        }),
      ]),
      Animated.stagger(
        120,
        optionsAnim.map((v) =>
          Animated.timing(v, { toValue: 1, duration: 300, useNativeDriver: true })
        )
      ),
    ]).start();
    setSelected(null);
  }, [idx, questions]);

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
        <Text>No hay preguntas en este set.</Text>
      </View>
    );
  }

  const q = questions[idx];

  /* ---- interacción ---- */
  const choose = (choiceIdx: number) => {
    if (selected !== null) return;
    setSelected(choiceIdx);

    /* pop */
    Animated.sequence([
      Animated.timing(optionsAnim[choiceIdx], {
        toValue: 1.1, duration: 80, useNativeDriver: true,
      }),
      Animated.timing(optionsAnim[choiceIdx], {
        toValue: 1, duration: 80, useNativeDriver: true,
      }),
    ]).start();
  };

  const next = async () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];

    if (idx < questions.length - 1) {
      setAnswers(newAnswers);
      setIdx((i) => i + 1);
      return;
    }

    /* --- última pregunta: enviar --- */
    try {
      const res = await submitFB(id, newAnswers); // {score,total,gained}
      updatePoints(res.gained);                  // suma puntos
      router.replace({
        pathname: "/minigames/fillblank-result",
        params: { score: String(res.score), total: String(res.total) },
      });
    } catch {
      Alert.alert("Error", "No se pudo enviar el resultado");
    }
  };

  /* ---- render ---- */
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.counter}>
        Pregunta {idx + 1} de {questions.length}
      </Text>

      <Animated.Text
        style={[
          styles.sentence,
          { opacity: sentenceOpacity, transform: [{ translateY: sentenceAnim }] },
        ]}
      >
        {q.prompt.replace("___", "______")}
      </Animated.Text>

      {q.choices.map((opt, i) => {
        const isSel   = selected === i;
        const correct = selected !== null && i === q.answer;
        const bg =
          selected === null ? "#FFFDE7"
          : correct           ? "#C8E6C9"
          : isSel             ? "#FFCDD2"
          : "#FFFDE7";

        return (
          <TouchableWithoutFeedback key={i} onPress={() => choose(i)}>
            <Animated.View
              style={[
                styles.option,
                {
                  backgroundColor: bg,
                  transform: [{
                    scale: optionsAnim[i].interpolate({
                      inputRange: [0, 1, 1.1],
                      outputRange: [0.8, 1, 1.1],
                    }),
                  }],
                  opacity: optionsAnim[i].interpolate({
                    inputRange: [0, 1], outputRange: [0, 1],
                  }),
                },
              ]}
            >
              <Text style={styles.optText}>{opt}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        );
      })}

      {selected !== null && (
        <TouchableWithoutFeedback onPress={next}>
          <View style={styles.nextBtn}>
            <Text style={styles.nextText}>
              {idx === questions.length - 1 ? "Ver resultado" : "Siguiente"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </ScrollView>
  );
}

/* ---- styles ---- */
const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#FDF7E2", minHeight: "100%" },
  center:  { flex: 1, justifyContent: "center", alignItems: "center" },

  counter:  { fontSize: 18, color: "#6D4C41", marginBottom: 12, fontWeight: "600" },
  sentence: { fontSize: 24, fontWeight: "700", color: "#3E2723", marginBottom: 24 },
  option: {
    padding: 16, borderRadius: 16, marginBottom: 14,
    borderWidth: 1, borderColor: "#e0d2b9",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
  },
  optText: { fontSize: 18, color: "#424242", fontWeight: "500" },
  nextBtn: {
    marginTop: 28, backgroundColor: "#FFB74D",
    padding: 16, borderRadius: 20, alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
