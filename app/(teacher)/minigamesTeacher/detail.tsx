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
    getMinigameDetail,
    MinigameStudent,
} from "../../../src/services/minigame.service";

export default function MinigameDetail() {
  const { id, classId } =
    useLocalSearchParams<{ id: string; classId: string }>();

  const [meta, setMeta] = useState<any>(null);
  const [students, setStudents] = useState<MinigameStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !classId) return;
    (async () => {
      const res = await getMinigameDetail(id, classId);
      setMeta(res.meta);
      setStudents(res.students);
      setLoading(false);
    })();
  }, [id, classId]);

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
        Promedio {meta.avgScore}% – {meta.attempts} partidas
      </Text>

      <FlatList
        data={students}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        keyExtractor={(s) => s.studentId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.small}>
              {item.attempts} intentos – {item.bestScore}%
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center:{ flex:1, justifyContent:"center", alignItems:"center" },
  wrapper:{ flex:1, backgroundColor:"#FFF", padding:16 },
  title:{ fontSize:22, fontWeight:"700", color:"#212121" },
  subtitle:{ fontSize:14, color:"#555", marginBottom:10 },
  sep:{ height:1, backgroundColor:"#eee" },
  row:{ flexDirection:"row", justifyContent:"space-between", paddingVertical:10 },
  name:{ fontSize:16 },
  small:{ fontSize:14, color:"#555" },
});
