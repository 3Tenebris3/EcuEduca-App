import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SequenceResult() {
  const { correct, total } = useLocalSearchParams<{ correct: string; total: string }>();
  const c = parseInt(correct || "0", 10);
  const t = parseInt(total  || "1", 10);

  const msg =
    c === t ? "¡Orden perfecto!" :
    c >= t * 0.7 ? "¡Muy bien!"   :
    "¡Intenta de nuevo!";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔢 Resultado 🔢</Text>
      <Text style={styles.msg}>{msg}</Text>

      <View style={styles.stars}>
        {[...Array(c)].map((_, i) => <FontAwesome key={i} name="star" size={30} color="#FFD700" />)}
        {[...Array(t - c)].map((_, i) => <FontAwesome key={i} name="star-o" size={30} color="#CCC" />)}
      </View>

      <Text style={styles.score}>{c} de {t} en posición correcta</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.replace("/minigames")}>
        <Text style={styles.btnText}>Volver a minijuegos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#EFEBE9", alignItems:"center", justifyContent:"center", padding:24 },
  title:{ fontSize:26, fontWeight:"bold", color:"#5D4037", marginBottom:12 },
  msg:{ fontSize:20, color:"#4E342E", marginBottom:24, textAlign:"center" },
  stars:{ flexDirection:"row", marginBottom:24 },
  score:{ fontSize:18, color:"#3E2723", marginBottom:32 },
  btn:{ backgroundColor:"#6D4C41", paddingVertical:14, paddingHorizontal:28, borderRadius:18 },
  btnText:{ color:"#fff", fontSize:16, fontWeight:"600" },
});
