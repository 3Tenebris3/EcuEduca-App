import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuizResult() {
  const { score, total } = useLocalSearchParams<{ score: string; total: string }>();
  const s = parseInt(score || "0", 10);
  const t = parseInt(total || "1", 10);

  const msg =
    s === t ? "¡Historiador experto!" :
    s >= t * 0.7 ? "¡Muy bien!" :
    "¡Sigue estudiando!";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Resultado 📚</Text>
      <Text style={styles.msg}>{msg}</Text>

      <View style={styles.stars}>
        {[...Array(s)].map((_, i) => (
          <FontAwesome key={i} name="star" size={30} color="#FFD700" />
        ))}
        {[...Array(t - s)].map((_, i) => (
          <FontAwesome key={i} name="star-o" size={30} color="#CCC" />
        ))}
      </View>

      <Text style={styles.score}>
        {s} de {t} correctas
      </Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.replace("/quizzes")}>
        <Text style={styles.btnTxt}>Volver a cuestionarios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#FFFDE7", alignItems:"center", justifyContent:"center", padding:24 },
  title:{ fontSize:26, fontWeight:"bold", color:"#8D6E63", marginBottom:12 },
  msg:{ fontSize:20, color:"#795548", marginBottom:24, textAlign:"center" },
  stars:{ flexDirection:"row", marginBottom:24 },
  score:{ fontSize:18, color:"#5D4037", marginBottom:32 },
  btn:{ backgroundColor:"#FFB74D", paddingVertical:14, paddingHorizontal:28, borderRadius:18 },
  btnTxt:{ color:"#fff", fontSize:16, fontWeight:"600" },
});
