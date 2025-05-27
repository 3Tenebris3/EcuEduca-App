/* app/minigames/memory-result.tsx */
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { saveMinigameProgress } from "@/services/progress.service";

/* ------------------------------------------------------------- */
export default function MemoryResult() {
  /* parámetros que llegan en la URL */
  const { moves, pairs, gained, id } = useLocalSearchParams<{
    moves?:  string;
    pairs?:  string;
    gained?: string;   // puntos que calculaste en la pantalla-juego
    id?:     string;   // ← tablero (memory1, memory2…)
  }>();

  /* saneo rápido */
  const mv  = Number.isFinite(+moves!)  ? +moves!  : 0;
  const pr  = Number.isFinite(+pairs!)  ? +pairs!  : 1;
  const pts = Number.isFinite(+gained!) ? +gained! : 0;

  /* ── registra el progreso SOLO una vez ── */
  useEffect(() => {
    if (id) saveMinigameProgress(id, pts).catch(console.error);
  }, []);

  /* mensaje según rendimiento */
  const msg =
    mv <= pr * 2 ? "¡Memoria prodigiosa! 🧠✨"
    : mv <= pr * 3 ? "¡Muy bien! 🎉"
    :                "¡Buen esfuerzo! 💪";

  /* UI */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 ¡Juego completado! 🎉</Text>
      <Text style={styles.message}>{msg}</Text>

      <View style={styles.statsBox}>
        <FontAwesome name="check-circle" size={30} color="#66BB6A" />
        <Text style={styles.statsText}>
          Pares totales: {pr}
          {"\n"}Movimientos: {mv}
          {"\n"}Puntos ganados: +{pts}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.replace("/minigames")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Volver a minijuegos</Text>
      </TouchableOpacity>
    </View>
  );
}

/* estilos (sin cambios) */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#E8EAF6", alignItems:"center",
              justifyContent:"center", padding:24 },
  title:{ fontSize:26, fontWeight:"bold", color:"#3F51B5", marginBottom:12 },
  message:{ fontSize:20, color:"#303F9F", marginBottom:24, textAlign:"center" },
  statsBox:{ flexDirection:"row", backgroundColor:"#C5CAE9", padding:16,
             borderRadius:16, marginBottom:32, alignItems:"center" },
  statsText:{ marginLeft:12, fontSize:16, color:"#1A237E" },
  button:{ backgroundColor:"#5C6BC0", paddingVertical:14, paddingHorizontal:28,
           borderRadius:18 },
  buttonText:{ color:"#fff", fontSize:16, fontWeight:"600" },
});
