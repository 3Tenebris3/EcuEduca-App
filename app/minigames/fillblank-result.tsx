/* app/minigames/fillblank-result.tsx */
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FillBlankResult() {
  /* -------- parámetros -------- */
  const { score, total } =
    useLocalSearchParams<{ score?: string; total?: string }>();

  const s = Number.isFinite(+score!) ? +score! : 0;  // fallback seguro
  const t = Number.isFinite(+total!) ? +total! : 1;

  /* -------- mensaje -------- */
  const msg =
    s === t       ? "¡Increíble!" :
    s >= t * 0.7  ? "¡Muy bien!"  :
                    "¡Sigue practicando!";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Resultados 📜</Text>
      <Text style={styles.msg}>{msg}</Text>

      {/* estrellas */}
      <View style={styles.stars}>
        {[...Array(s)].map((_, i) => (
          <FontAwesome key={`f${i}`} name="star"   size={30} color="#FFD700" />
        ))}
        {[...Array(t - s)].map((_, i) => (
          <FontAwesome key={`e${i}`} name="star-o" size={30} color="#CCC" />
        ))}
      </View>

      <Text style={styles.score}>
        {s} de {t} respuestas correctas
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace("/minigames")}
      >
        <Text style={styles.btnText}>Volver a minijuegos</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#FFFDE7", alignItems:"center",
              justifyContent:"center", padding:24 },
  title:{ fontSize:26, fontWeight:"bold", color:"#8D6E63", marginBottom:12 },
  msg:{ fontSize:20, color:"#795548", marginBottom:24, textAlign:"center" },
  stars:{ flexDirection:"row", marginBottom:24 },
  score:{ fontSize:18, color:"#5D4037", marginBottom:32 },
  btn:{ backgroundColor:"#FFA726", paddingVertical:14,
        paddingHorizontal:28, borderRadius:18 },
  btnText:{ color:"#fff", fontSize:16, fontWeight:"600" },
});
