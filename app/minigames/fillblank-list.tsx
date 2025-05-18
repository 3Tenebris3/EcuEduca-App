import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const sets = [
  { id: "fb1", title: "Antiguo Egipto", completed: false },
  { id: "fb2", title: "Imperio Romano", completed: true },
  { id: "fb3", title: "Edad Media",    completed: false },
];

export default function FillBlankList() {
  const go = (s: typeof sets[0]) => {
    if (s.completed) {
      router.push({ pathname: "/minigames/fillblank-result", params: { score: "4", total: "5" } });
    } else {
      router.push({ pathname: "/minigames/fillblank", params: { id: s.id } });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Elige un reto de Historia 📜</Text>
      {sets.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={[styles.card, { backgroundColor: s.completed ? "#C8E6C9" : "#FFE0B2" }]}
          onPress={() => go(s)}
        >
          <Text style={styles.cardText}>{s.title}</Text>
          <Text style={styles.status}>{s.completed ? "✅ Completado" : "⏳ Pendiente"}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ padding:16, backgroundColor:"#FFF8E1", minHeight:"100%" },
  title:{ fontSize:24, fontWeight:"bold", marginBottom:24, color:"#444" },
  card:{ padding:16, borderRadius:16, marginBottom:16, shadowColor:"#000",
         shadowOpacity:0.1, shadowRadius:4 },
  cardText:{ fontSize:18, fontWeight:"600", color:"#333" },
  status:{ marginTop:8, fontSize:14, color:"#666" },
});
