/* app/teacher/index.tsx */
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_W = (width - 48) / 2;

/* rutas absolutas dentro de /teacher */
const SECTIONS = [
  {
    title: "Configurar Escenarios",
    icon: <Ionicons name="planet" size={30} color="#fff" />,
    color: "#4CAF50",
    path: "/scenariosTeacher",
  },
  {
    title: "Configurar Minijuegos",
    icon: <FontAwesome5 name="gamepad" size={26} color="#fff" />,
    color: "#FF9800",
    path: "/minigamesTeacher",
  },
  {
    title: "Configurar Puntos",
    icon: <MaterialCommunityIcons name="star-circle" size={30} color="#fff" />,
    color: "#2196F3",
    path: "/points",
  },
  {
    title: "Configurar Reportes",
    icon: <Ionicons name="bar-chart" size={30} color="#fff" />,
    color: "#9C27B0",
    path: "/reports",
  },
];

export default function TeacherHome() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {SECTIONS.map((sec) => (
          <TouchableOpacity
            key={sec.title}
            style={[styles.card, { backgroundColor: sec.color }]}
            onPress={() => router.push(sec.path)}
            activeOpacity={0.85}
          >
            {sec.icon}
            <Text style={styles.cardTxt}>{sec.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FAB Configuraciones */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/settings")}
        accessibilityLabel="Configuraciones"
      >
        <Feather name="settings" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 16, backgroundColor: "#F3F4F6" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: CARD_W,
    height: 120,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTxt: { color: "#fff", fontSize: 16, fontWeight: "600", marginTop: 8 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: "#607D8B",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
});
