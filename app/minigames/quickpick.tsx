import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const COLS = 4;
const BTN_SIZE = (width - 16 * 2 - 8 * (COLS - 1)) / COLS;
const TOTAL_TIME = 30;
const REFRESH_INTERVAL = 5;               // ← 5 s mínimo antes de cambiar

type Theme = { targets: string[]; distractors: string[]; bg: string };

const THEMES: Record<string, Theme> = {
  egipto: {
    targets: ["🪔", "🛕", "🐫"],
    distractors: ["⚔️", "🪖", "🎺", "🚢", "🧭"],
    bg: "#FFF7E0",
  },
  roma: {
    targets: ["🏛️", "🦅", "👑"],
    distractors: ["🏺", "⚙️", "🗿", "⛵️", "📝"],
    bg: "#FDF1E3",
  },
  default: {
    targets: ["🏰", "⚔️", "🛡️"],
    distractors: ["🍇", "🚗", "⚽️", "🌵", "🎺"],
    bg: "#E3F2FD",
  },
};

export default function QuickPick() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme =
    THEMES[id === "qp1" ? "egipto" : id === "qp2" ? "roma" : "default"];

  const [grid, setGrid] = useState<string[]>([]);
  const [target, setTarget] = useState<string>(theme.targets[0]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [time, setTime] = useState(TOTAL_TIME);

  const bar = useRef(new Animated.Value(1)).current;

  /* ── crear tablero inicial ── */
  useEffect(refreshGrid, []);

  /* ── cuenta atrás 1 s ── */
  useEffect(() => {
    const int = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);
    return () => clearInterval(int);
  }, []);

  /* ── cada cambio de tiempo ── */
  useEffect(() => {
    // animar barra
    Animated.timing(bar, {
      toValue: time / TOTAL_TIME,
      duration: 250,
      useNativeDriver: false,
    }).start();

    // refrescar cuadrícula cada 5 s
    if (time > 0 && time % REFRESH_INTERVAL === 0) {
      refreshGrid();
    }

    // terminar juego
    if (time === 0) {
      router.replace({
        pathname: "/minigames/quickpick-result",
        params: { hits: hits.toString(), misses: misses.toString() },
      });
    }
  }, [time]);

  /* ── generar nuevo tablero ── */
  function refreshGrid() {
    const items: string[] = [];
    for (let i = 0; i < 20; i++) {
      const isTarget = Math.random() < 0.35;
      const arr = isTarget ? theme.targets : theme.distractors;
      items.push(arr[Math.floor(Math.random() * arr.length)]);
    }
    setGrid(items);
    setTarget(theme.targets[Math.floor(Math.random() * theme.targets.length)]);
  }

  /* ── tap ── */
  const handlePress = (emoji: string, idx: number) => {
    setGrid((prev) => {
      const next = [...prev];
      next[idx] = "";
      return next;
    });
    if (emoji === target) setHits((h) => h + 1);
    else setMisses((m) => m + 1);
  };

  /* ── render ── */
  return (
    <View style={[styles.wrapper, { backgroundColor: theme.bg }]}>
      <Text style={styles.title}>Encuentra:</Text>
      <Text style={styles.bigTarget}>{target}</Text>

      <View style={styles.progressBox}>
        <Animated.View style={[styles.progressBar, { flex: bar }]} />
      </View>
      <Text style={styles.timer}>⏱ {time}s</Text>
      <Text style={styles.counter}>
        ✅ {hits} - ❌ {misses}
      </Text>

      <View style={styles.grid}>
        {grid.map((emoji, i) => (
          <TouchableOpacity
            key={i}
            style={styles.btn}
            onPress={() => emoji && handlePress(emoji, i)}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

/* ───────── estilos ───────── */
const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "600", color: "#5D4037" },
  bigTarget: { fontSize: 42, marginVertical: 4 },
  progressBox: {
    height: 10,
    width: "100%",
    backgroundColor: "#DDD",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 4,
  },
  progressBar: { backgroundColor: "#FF7043" },
  timer: { fontSize: 18, color: "#BF360C", marginTop: 4 },
  counter: { fontSize: 16, color: "#3E2723", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    margin: 8,
    backgroundColor: "#90CAF9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  emoji: { fontSize: 30 },
});
