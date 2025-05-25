/* app/minigames/trivia-list.tsx */
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getTriviaSets, TriviaSet } from "@/services/trivia.service";

export default function TriviaListScreen() {
  const [sets, setSets]     = useState<TriviaSet[]>([]);
  const [loading, setLoad]  = useState(true);

  /* ───── carga inicial ───── */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getTriviaSets();        // GET /minigames/trivia/sets
        if (active) setSets(data);
      } finally {
        if (active) setLoad(false);
      }
    })();
    return () => { active = false; };
  }, []);

  /* ───── tap ───── */
  const go = (t: TriviaSet) => {
    if (t.completed) {
      router.push({
        pathname: "/minigames/trivia-result",
        params: {
          score:  String(t.lastScore ?? 0),
          total:  String(t.total ?? 0),
          gained: "0",
        },
      });
    } else {
      router.push({ pathname: "/minigames/trivia", params: { id: t.id } });
    }
  };

  /* ───── UI ───── */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Elige una Trivia 🧠</Text>

      {sets.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={[
            styles.card,
            { backgroundColor: t.completed ? "#C8E6C9" : "#FFECB3" },
          ]}
          onPress={() => go(t)}
        >
          <Text style={styles.cardText}>{t.title}</Text>
          <Text style={styles.status}>
            {t.completed ? "✅ Completada" : "⏳ Pendiente"}
          </Text>
        </TouchableOpacity>
      ))}

      {!sets.length && (
        <Text style={{ textAlign: "center", marginTop: 24, color: "#666" }}>
          No hay trivias disponibles.
        </Text>
      )}
    </ScrollView>
  );
}

/* ───── styles ───── */
const styles = StyleSheet.create({
  center:{ flex:1, justifyContent:"center", alignItems:"center" },

  container:{ padding:16, backgroundColor:"#FFF8E1", minHeight:"100%" },
  title:{ fontSize:24, fontWeight:"bold", marginBottom:24, color:"#444" },

  card:{
    padding:16, borderRadius:16, marginBottom:16,
    shadowColor:"#000", shadowOffset:{ width:0, height:2 },
    shadowOpacity:0.1, shadowRadius:4,
  },
  cardText:{ fontSize:18, fontWeight:"600", color:"#333" },
  status:{ marginTop:8, fontSize:14, color:"#666" },
});
