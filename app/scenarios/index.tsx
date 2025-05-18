import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

/* ───── Escenarios mock ───── */
type Scene = {
  id: string;
  title: string;
  teaser: any;     // imagen local require() o { uri }
  completed: boolean;
};

const SCENES: Scene[] = [
  {
    id: "piramide",
    title: "Dentro de la Gran Pirámide",
    teaser: require("../../assets/scenes/pyramid.png"),   // ⇦ pon tus capturas
    completed: false,
  },
  {
    id: "coliseo",
    title: "Arena del Coliseo",
    teaser: require("../../assets/scenes/coliseum.png"),
    completed: true,
  },
  {
    id: "castillo",
    title: "Castillo Medieval",
    teaser: require("../../assets/scenes/castle.png"),
    completed: false,
  },
];

export default function ScenariosList() {
  const enterScene = (s: Scene) =>
    router.push({ pathname: "/scenarios/play", params: { id: s.id } });

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.title}>Explora escenarios en RA 🏺🏰</Text>

      {SCENES.map((s, idx) => (
        <Animated.View
          key={s.id}
          entering={FadeInDown.delay(idx * 60)}
          style={[
            styles.card,
            { backgroundColor: s.completed ? "#C8E6C9" : "#FFFDE7" },
          ]}
        >
          <Image source={s.teaser} style={styles.img} resizeMode="cover" />

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text style={styles.status}>
              {s.completed ? "✅ Completado" : "👀 Por descubrir"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => enterScene(s)}
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
    </ScrollView>
  );
}

/* ───── styles ───── */
const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#F1F8E9", minHeight: "100%" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#33691E" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#37474F" },
  status: { fontSize: 14, color: "#5D4037", marginTop: 4 },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  btnTxt: { color: "#fff", fontWeight: "600" },
});
