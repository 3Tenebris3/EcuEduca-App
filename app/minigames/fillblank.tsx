import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

/* ── Banco de preguntas de prueba ── */
type Q = { sentence: string; options: string[]; answer: string };

const BANK: Record<string, Q[]> = {
  fb1: [
    {
      sentence: "El río ___ era vital para el Antiguo Egipto.",
      options: ["Nilo", "Tigris", "Amazonas", "Ebro"],
      answer: "Nilo",
    },
    {
      sentence: "Los ___ construyeron las pirámides.",
      options: ["escribas", "faraones", "campesinos", "sacerdotes"],
      answer: "faraones",
    },
    {
      sentence: "La escritura egipcia se llamaba ___.",
      options: ["cuneiforme", "jeroglífica", "latina", "gótica"],
      answer: "jeroglífica",
    },
  ],
  fb2: [
    {
      sentence: "Roma fue fundada, según la leyenda, por ___ y Remo.",
      options: ["Rómulo", "Julio", "Marco", "Nerón"],
      answer: "Rómulo",
    },
    {
      sentence: "El anfiteatro más famoso es el ___.",
      options: ["Partenón", "Coliseo", "Panteón", "Circo"],
      answer: "Coliseo",
    },
  ],
};

export default function FillBlank() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const questions = BANK[id] || [];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  /* refs de animación */
  const sentenceAnim = useRef(new Animated.Value(-50)).current; // Y inicial
  const sentenceOpacity = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef<Animated.Value[]>([]).current;

  /* inicializar array de Animated.Value por opción */
  if (optionsAnim.length !== (questions[idx]?.options.length || 0)) {
    optionsAnim.length = 0;
    questions[idx]?.options.forEach(() =>
      optionsAnim.push(new Animated.Value(0)),
    );
  }

  /* animación de entrada cada vez que cambia idx */
  useEffect(() => {
    sentenceAnim.setValue(-50);
    sentenceOpacity.setValue(0);
    optionsAnim.forEach((v) => v.setValue(0));

    Animated.sequence([
      Animated.parallel([
        Animated.timing(sentenceAnim, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(sentenceOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(
        120,
        optionsAnim.map((v) =>
          Animated.timing(v, { toValue: 1, duration: 300, useNativeDriver: true }),
        ),
      ),
    ]).start();
  }, [idx]);

  const q = questions[idx];

  const choose = (opt: string, i: number) => {
    if (selected) return;

    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);

    /* pequeño “pop” */
    Animated.sequence([
      Animated.timing(optionsAnim[i], {
        toValue: 1.1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(optionsAnim[i], {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const next = () => {
    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
    } else {
      router.replace({
        pathname: "/minigames/fillblank-result",
        params: {
          score: score.toString(),
          total: questions.length.toString(),
        },
      });
    }
  };

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
        {q.sentence.replace("___", "______")}
      </Animated.Text>

      {q.options.map((opt, i) => {
        const isSel = selected === opt;
        const correct = selected && opt === q.answer;
        const bg =
          !selected
            ? "#FFFDE7"
            : correct
            ? "#C8E6C9"
            : isSel
            ? "#FFCDD2"
            : "#FFFDE7";

        return (
          <TouchableWithoutFeedback key={opt} onPress={() => choose(opt, i)}>
            <Animated.View
              style={[
                styles.option,
                {
                  backgroundColor: bg,
                  transform: [
                    {
                      scale: optionsAnim[i].interpolate({
                        inputRange: [0, 1, 1.1],
                        outputRange: [0.8, 1, 1.1],
                      }),
                    },
                  ],
                  opacity: optionsAnim[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ]}
            >
              <Text style={styles.optText}>{opt}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        );
      })}

      {selected && (
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

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: "#FDF7E2",
    minHeight: "100%",
  },
  counter: {
    fontSize: 18,
    color: "#6D4C41",
    marginBottom: 12,
    fontWeight: "600",
  },
  sentence: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3E2723",
    marginBottom: 24,
  },
  option: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e0d2b9",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  optText: { fontSize: 18, color: "#424242", fontWeight: "500" },
  nextBtn: {
    marginTop: 28,
    backgroundColor: "#FFB74D",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
