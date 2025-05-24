/* app/quizzes/index.tsx */
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { fetchQuizList, QuizMeta } from "@/services/quiz.service";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizMeta[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefresh] = useState(false);

  /* --------- fetch wrapper --------- */
  const load = useCallback(async () => {
    try {
      const data = await fetchQuizList();   // [{ id,title,completed,score,total }]
      setQuizzes(data);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los cuestionarios");
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /* --------- navegación --------- */
  const go = (q: QuizMeta) => {
    if (q.completed) {
      router.push({
        pathname: "/quizzes/quiz-result",
        params: { score: String(q.score), total: String(q.total) },
      });
    } else {
      router.push({ pathname: "/quizzes/quiz", params: { id: q.id } });
    }
  };

  /* --------- UI --------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (quizzes.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={[styles.wrapper, styles.center]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefresh(true);
            load();
          }} />
        }
      >
        <Text style={{ fontSize: 18, color: "#555" }}>
          No hay cuestionarios disponibles.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.wrapper}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefresh(true);
          load();
        }} />
      }
    >
      <Text style={styles.title}>Elige tu cuestionario 📚</Text>

      {quizzes.map((q, idx) => (
        <Animated.View
          key={q.id}
          entering={FadeInDown.delay(idx * 80)}
          style={[
            styles.card,
            { backgroundColor: q.completed ? "#C8E6C9" : "#BBDEFB" },
          ]}
        >
          <TouchableOpacity onPress={() => go(q)}>
            <Text style={styles.label}>{q.title}</Text>
            <Text style={styles.status}>
              {q.completed
                ? `✅ Completado · ${q.score}/${q.total}`
                : `⏳ Pendiente · ${q.total} preguntas`}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#E3F2FD", minHeight: "100%" },
  center:  { flex: 1, justifyContent: "center", alignItems: "center" },
  title:   { fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#0D47A1" },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label:    { fontSize: 18, fontWeight: "600", color: "#0D47A1" },
  status:   { marginTop: 8, fontSize: 14, color: "#08306B" },
});
