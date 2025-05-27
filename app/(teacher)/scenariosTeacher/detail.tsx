import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  getSceneDetail,
  SceneStudent,
} from "../../../src/services/scene.service";

export default function SceneDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [meta, setMeta] = useState<any>(null);
  const [students, setStudents] = useState<SceneStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getSceneDetail(id);
        setMeta(res.meta);
        setStudents(res.students);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{meta.title}</Text>
      <Text style={styles.subtitle}>
        {meta.completed}/{meta.total} alumnos
      </Text>

      <FlatList
        data={students}
        contentContainerStyle={{ paddingVertical: 8 }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        keyExtractor={(s) => s.studentId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={[styles.badge, item.done && styles.done]}>
              {item.done ? "✔" : "—"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

/* --- styles --- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  wrapper: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#212121" },
  subtitle: { fontSize: 15, color: "#555", marginBottom: 10 },
  sep: { height: 1, backgroundColor: "#eee" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  name: { fontSize: 16 },
  badge: { fontSize: 18, color: "#BDBDBD" },
  done: { color: "#4CAF50" },
});
