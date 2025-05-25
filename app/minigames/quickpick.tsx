import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getQuickPickTheme,
  QPItem,
  QPTheme,
  submitQuickPick,
} from "@/services/quickpick.service";
import { usePointsStore } from "@/store/points";

////////////////////////////////////////////////////////////////////////////////
// 1.  Constantes de juego
////////////////////////////////////////////////////////////////////////////////
const TOTAL_TIME = 30;        // 30 s de partida
const REFRESH_INTERVAL = 5;   // refrescar tablero cada 5 s
const CELLS = 20;             // siempre 20 imágenes

////////////////////////////////////////////////////////////////////////////////
// 2.  Helpers layout (recalcular en cada rotación)
////////////////////////////////////////////////////////////////////////////////
const btnSize = () => {
  const { width, height } = Dimensions.get("window");
  const cols = height >= width ? 4 : 5;        // + columnas en apaisado
  return (width - 16 * 2 - 8 * (cols - 1)) / cols;
};

////////////////////////////////////////////////////////////////////////////////
// 3.  Componente
////////////////////////////////////////////////////////////////////////////////
export default function QuickPick() {
  const { id } = useLocalSearchParams<{ id: string }>();      // setId
  const [theme, setTheme] = useState<QPTheme | null>(null);

  /* estado de partida */
  const [grid,   setGrid]   = useState<QPItem[]>([]);
  const [target, setTarget] = useState<QPItem | null>(null);
  const [hits,   setHits]   = useState(0);
  const [misses, setMisses] = useState(0);
  const [time,   setTime]   = useState(TOTAL_TIME);
  const [size,   setSize]   = useState(btnSize());
  const [loading, setLoading] = useState(true);

  const bar = useRef(new Animated.Value(1)).current;
  const addPoints = usePointsStore((s) => s.updatePoints);

  ////////////////////////////////////////////////////////////////////////////
  //  Cargar tema desde el backend
  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const t = await getQuickPickTheme(id);
        if (!active) return;
        setTheme(t);
        initBoard(t);
      } catch {
        Alert.alert("Error", "No se pudo cargar el minijuego", [
          { text: "Volver", onPress: () => router.back() },
        ]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  ////////////////////////////////////////////////////////////////////////////
  //  Reloj — 1 s
  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (loading) return;
    const int = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(int);
  }, [loading]);

  ////////////////////////////////////////////////////////////////////////////
  //  Efectos al cambiar tiempo
  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (loading) return;

    // barra de progreso
    Animated.timing(bar, {
      toValue: time / TOTAL_TIME,
      duration: 250,
      useNativeDriver: false,
    }).start();

    // refresco periódico
    if (time > 0 && time % REFRESH_INTERVAL === 0 && theme) initBoard(theme);

    // fin de juego
    if (time === 0 && theme) onFinish();
  }, [time]);

  ////////////////////////////////////////////////////////////////////////////
  //  Rotación de pantalla → recalcular tamaño
  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", () => setSize(btnSize()));
    return () => sub?.remove();
  }, []);

  ////////////////////////////////////////////////////////////////////////////
  //  Funciones
  ////////////////////////////////////////////////////////////////////////////
  const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  function initBoard(t: QPTheme) {
    const items: QPItem[] = [];
    for (let i = 0; i < CELLS; i++) {
      const useTarget = Math.random() < 0.35;
      items.push(rand(useTarget ? t.targets : t.distractors));
    }
    setGrid(items);
    setTarget(rand(t.targets));
  }

  const tap = (item: QPItem, idx: number) => {
    setGrid((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], imgUrl: "" }; // celda en blanco
      return next;
    });

    if (item.id === target?.id) setHits((h) => h + 1);
    else                         setMisses((m) => m + 1);
  };

  async function onFinish() {
    try {
      const res = await submitQuickPick(id, hits, misses);
      addPoints(res.gained);
      router.replace({
        pathname: "/minigames/quickpick-result",
        params: {
          hits:    String(hits),
          misses:  String(misses),
          gained:  String(res.gained),
        },
      });
    } catch {
      router.replace({
        pathname: "/minigames/quickpick-result",
        params: { hits: String(hits), misses: String(misses) },
      });
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  //  Render
  ////////////////////////////////////////////////////////////////////////////
  if (loading || !theme || !target) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.bg }]}>
      <Text style={styles.title}>Encuentra:</Text>
      <Text style={styles.bigTarget}>{target.name}</Text>

      {/* barra de tiempo */}
      <View style={styles.progressBox}>
        <Animated.View style={[styles.progressBar, { flex: bar }]} />
      </View>
      <Text style={styles.timer}>⏱ {time}s</Text>
      <Text style={styles.counter}>
        ✅ {hits}  –  ❌ {misses}
      </Text>

      {/* grid */}
      <View style={styles.grid}>
        {grid.map((it, i) => (
          <TouchableOpacity
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`cell-${i}`}
            style={[styles.btn, { width: size, height: size }]}
            onPress={() => it.imgUrl && tap(it, i)}
            activeOpacity={0.85}
          >
            {it.imgUrl !== "" && (
              <Image
                source={{ uri: it.imgUrl }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

////////////////////////////////////////////////////////////////////////////////
// 4.  Styles
////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  center:{ flex:1, justifyContent:"center", alignItems:"center" },

  wrapper:{ flex:1, padding:16 },
  title:{ fontSize:20, fontWeight:"600", color:"#5D4037" },
  bigTarget:{ fontSize:22, fontWeight:"700", marginVertical:6, color:"#1B1B1B" },

  progressBox:{
    height:10, borderRadius:5, overflow:"hidden",
    backgroundColor:"#DDD", marginTop:4,
  },
  progressBar:{ backgroundColor:"#FF7043" },
  timer:{ fontSize:18, color:"#BF360C", marginTop:4 },
  counter:{ fontSize:16, color:"#3E2723", marginBottom:12 },

  grid:{ flexDirection:"row", flexWrap:"wrap", justifyContent:"center" },
  btn:{
    margin:8, borderRadius:14, backgroundColor:"#E1F5FE",
    alignItems:"center", justifyContent:"center",
    shadowColor:"#000", shadowOpacity:0.12, shadowRadius:3, elevation:3,
  },
  image:{ width:"80%", height:"80%" },
});
