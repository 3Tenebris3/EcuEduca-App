/* app/scenarios/index.tsx */
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { getScenes, SceneMeta } from "../../src/services/scene.service";

export default function ScenariosList() {
  const [scenes, setScenes]   = useState<SceneMeta[]>([]);
  const [loading, setLoading] = useState(true);

  /* ───── carga inicial ───── */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getScenes();      // GET /scenarios
        if (active) setScenes(data);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  /* ───── navegación ───── */
  const go = (s: SceneMeta) =>
    router.push({ pathname: "/scenarios/preview", params: { id: s.id } });

  /* ───── UI ───── */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.title}>Explora escenarios en RA 🏺🏰</Text>

      {scenes.map((s, idx) => (
        <Animated.View
          key={s.id}
          entering={FadeInDown.delay(idx * 60)}
          style={[
            styles.card,
            { backgroundColor: s.completed ? "#C8E6C9" : "#FFFDE7" },
          ]}
        >
          <Image source={{ uri: s.preview }} style={styles.img} />

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text style={styles.status}>
              {s.completed ? "✅ Completado" : "👀 Por descubrir"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => go(s)}
            style={[
              styles.btn,
              { backgroundColor: s.completed ? "#FFB74D" : "#64B5F6" },
            ]}
          >
            <Text style={styles.btnTxt}>
              {s.completed ? "Repetir" : "Comenzar"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {!scenes.length && (
        <Text style={{ textAlign: "center", marginTop: 24, color: "#666" }}>
          Aún no hay escenarios disponibles
        </Text>
      )}
    </ScrollView>
  );
}

/* ───── estilos ───── */
const styles = StyleSheet.create({
  center:{ flex:1, justifyContent:"center", alignItems:"center" },

  wrapper:{ padding:16, backgroundColor:"#F1F8E9", minHeight:"100%" },
  title:{ fontSize:24, fontWeight:"bold", marginBottom:24, color:"#33691E" },
  card:{
    flexDirection:"row", alignItems:"center",
    padding:12, borderRadius:18, marginBottom:16,
    shadowColor:"#000", shadowOpacity:0.08, shadowRadius:3, elevation:2,
  },
  img:{ width:80, height:80, borderRadius:12, marginRight:12 },
  cardTitle:{ fontSize:18, fontWeight:"600", color:"#37474F" },
  status:{ fontSize:14, color:"#5D4037", marginTop:4 },
  btn:{ paddingVertical:8, paddingHorizontal:14, borderRadius:14 },
  btnTxt:{ color:"#fff", fontWeight:"600" },
});
