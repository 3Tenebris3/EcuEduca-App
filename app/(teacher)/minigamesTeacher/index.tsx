import { Picker } from "@react-native-picker/picker";
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

import { router } from "expo-router";
import { getClasses } from "../../../src/services/class.service";
import {
    getMinigameResumes,
    MinigameResume,
} from "../../../src/services/minigame.service";

export default function TeacherMinigameList() {
  const [classes, setClasses]   = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const [data, setData]   = useState<MinigameResume[]>([]);
  const [loading, setLoading] = useState(true);

  /* clases del profe */
  useEffect(() => {
    (async () => {
      const cls = await getClasses();
      setClasses(cls);
      if (cls[0]) setSelected(cls[0].id);
    })();
  }, []);

  /* minijuegos según clase */
  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    (async () => {
      const res = await getMinigameResumes(selected);
      setData(res);
      setLoading(false);
    })();
  }, [selected]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Picker
        selectedValue={selected}
        onValueChange={(v) => setSelected(v)}
        style={styles.picker}
      >
        {classes.map((c) => (
          <Picker.Item key={c.id} label={c.name} value={c.id} />
        ))}
      </Picker>

      {data.map((m, idx) => {
        const pct = Math.round((m.avgScore)) || 0;
        return (
          <Animated.View
            key={m.id}
            entering={FadeInDown.delay(idx * 60)}
            style={styles.card}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{m.title}</Text>
              <Text style={styles.small}>
                Intentos: {m.attempts} – Promedio: {pct}%
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                selected &&
                router.push({
                  pathname: "/teacher/minigames/detail",
                  params: { id: m.id, classId: selected },
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
          Sin datos para esta clase.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center:{ flex:1, justifyContent:"center", alignItems:"center" },
  wrapper:{ padding:16, backgroundColor:"#FAFAFA", minHeight:"100%" },
  picker:{ marginBottom:16 },
  card:{
    flexDirection:"row", alignItems:"center",
    padding:12, borderRadius:16, marginBottom:14,
    shadowColor:"#000", shadowOpacity:0.08, shadowRadius:3, elevation:2,
    backgroundColor:"#FFFDE7",
  },
  cardTitle:{ fontSize:17, fontWeight:"600", color:"#212121" },
  small:{ fontSize:13, color:"#555", marginTop:2 },
  btn:{ backgroundColor:"#64B5F6", paddingVertical:8, paddingHorizontal:18,
        borderRadius:14 },
  btnTxt:{ color:"#fff", fontWeight:"600" },
});
