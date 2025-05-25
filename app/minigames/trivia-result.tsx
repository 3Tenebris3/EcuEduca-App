/* app/minigames/trivia-result.tsx */
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TriviaResultScreen() {
  /* params enviados desde TriviaGame */
  const { score, total, gained } = useLocalSearchParams<{
    score:  string;
    total:  string;
    gained?: string;          // puede no venir si submit falló
  }>();

  const correct = parseInt(score  ?? "0", 10);
  const all     = parseInt(total  ?? "1", 10);
  const bonus   = parseInt(gained ?? "0", 10);

  /* mensaje motivacional */
  const ratio = correct / all;
  const msg =
    ratio === 1   ? "¡Excelente! 🌟"          :
    ratio >= 0.7  ? "¡Muy bien! 🎉"           :
    ratio >= 0.5  ? "¡Buen intento! 💪"       :
                    "¡Puedes hacerlo mejor! 🙌";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎊 Resultados 🎊</Text>
      <Text style={styles.message}>{msg}</Text>

      {/* estrellas */}
      <View style={styles.stars}>
        {[...Array(correct)].map((_, i) => (
          <FontAwesome key={i} name="star"   size={32} color="#FFD700" />
        ))}
        {[...Array(all - correct)].map((_, i) => (
          <FontAwesome key={i} name="star-o" size={32} color="#CCC"    />
        ))}
      </View>

      <Text style={styles.score}>
        {correct} de {all} correctas
      </Text>

      {!!bonus && (
        <Text style={styles.bonus}>
          +{bonus} puntos de recompensa 🎁
        </Text>
      )}

      <TouchableOpacity style={styles.btn} onPress={() => router.replace("/minigames")}>
        <Text style={styles.btnTxt}>Volver a minijuegos</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ───── styles ───── */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#F3E5F5",
              alignItems:"center", justifyContent:"center", padding:24 },

  title:{ fontSize:28, fontWeight:"bold", color:"#6A1B9A", marginBottom:12 },
  message:{ fontSize:22, color:"#4A148C", marginBottom:24, textAlign:"center" },

  stars:{ flexDirection:"row", marginBottom:24 },
  score:{ fontSize:18, color:"#4A148C", marginBottom:8 },
  bonus:{ fontSize:18, color:"#1B5E20", marginBottom:32, fontWeight:"600" },

  btn:{ backgroundColor:"#8E24AA", paddingVertical:14, paddingHorizontal:28, borderRadius:18 },
  btnTxt:{ color:"#fff", fontSize:16, fontWeight:"600" },
});
