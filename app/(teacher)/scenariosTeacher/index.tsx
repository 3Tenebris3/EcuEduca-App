import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  getTeacherScenes,
  SceneResume,
} from "../../../src/services/scene.service";

export default function TeacherSceneList() {
  const [data, setData] = useState<SceneResume[]>([]);
  const [loading, setLoading] = useState(true);

  /* inicial */
  useEffect(() => {
    (async () => {
      try {
        const res = await getTeacherScenes();
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* loading state */
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.title}>Escenarios 🔎</Text>

      {data.map((s, idx) => {
        const pct = Math.round((s.completed / s.total) * 100) || 0;
        const done = pct === 100;

        return (
          <Animated.View
            key={s.id}
            entering={FadeInDown.delay(idx * 60)}
            style={[
              styles.card,
              { backgroundColor: done ? "#C8E6C9" : "#FFFDE7" },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{s.title}</Text>
              <Text style={styles.small}>
                {pct}% – {s.completed}/{s.total} alumnos
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: done ? "#8BC34A" : "#64B5F6" },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/teacher/scenarios/detail",
                  params: { id: s.id },
                })
              }
            >
              <Text style={styles.btnTxt}>Ver</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {!data.length && (
        <Text style={{ textAlign: "center", marginTop: 32, color: "#666" }}>
          Sin escenarios asignados.
        </Text>
      )}
    </ScrollView>
  );
}

/* --- styles --- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  wrapper: { padding: 16, minHeight: "100%", backgroundColor: "#FAFAFA" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#37474F" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 17, fontWeight: "600", color: "#212121" },
  small: { fontSize: 13, color: "#616161", marginTop: 2 },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  btnTxt: { color: "#fff", fontWeight: "600" },
});
