import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const sets = [
  { id: "seq1", title: "Faraones de Egipto", completed: false },
  { id: "seq2", title: "Emperadores Romanos (primeros)", completed: true },
  { id: "seq3", title: "Inventos de la Edad Media", completed: false },
];

export default function SequenceList() {
  const go = (s: typeof sets[0]) => {
    if (s.completed) {
      router.push({ pathname: "/minigames/sequence-result", params: { correct: "5", total: "5" } });
    } else {
      router.push({ pathname: "/minigames/sequence", params: { id: s.id } });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Elige una secuencia 🏛️</Text>
      {sets.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={[styles.card, { backgroundColor: s.completed ? "#C8E6C9" : "#BBDEFB" }]}
          onPress={() => go(s)}
        >
          <Text style={styles.cardText}>{s.title}</Text>
          <Text style={styles.status}>{s.completed ? "✅ Completada" : "⏳ Pendiente"}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ padding:16, backgroundColor:"#E3F2FD", minHeight:"100%" },
  title:{ fontSize:24, fontWeight:"bold", marginBottom:24, color:"#0D47A1" },
  card:{ padding:16, borderRadius:16, marginBottom:16, shadowColor:"#000",
         shadowOpacity:0.1, shadowRadius:4 },
  cardText:{ fontSize:18, fontWeight:"600", color:"#0D47A1" },
  status:{ marginTop:8, fontSize:14, color:"#08306B" },
});
