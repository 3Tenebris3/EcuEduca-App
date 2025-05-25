import { getSequenceSets, SeqSetSummary } from "@/services/sequence.service";
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

export default function SequenceList() {
  const [sets, setSets]   = useState<SeqSetSummary[]>([]);
  const [loading, setLoading] = useState(true);

  /* fetch on mount */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getSequenceSets();
        if (active) setSets(data);
      } catch {
        // opcional: notifica error
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  /* click */
  const go = (s: SeqSetSummary) => {
    if (s.completed) {
      router.push({
        pathname: "/minigames/sequence-result",
        params: { correct: String(0), total: String(0) }, // el result real vendrá desde scoreboard
      });
    } else {
      router.push({ pathname: "/minigames/sequence", params: { id: s.id } });
    }
  };

  /* UI */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (sets.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No hay secuencias disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Elige una secuencia 🏛️</Text>
      {sets.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={[
            styles.card,
            { backgroundColor: s.completed ? "#C8E6C9" : "#BBDEFB" },
          ]}
          onPress={() => go(s)}
        >
            <Text style={styles.cardText}>{s.title}</Text>
            <Text style={styles.status}>
              {s.completed ? "✅ Completada" : "⏳ Pendiente"}
            </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

/* styles */
const styles = StyleSheet.create({
  center:{ flex:1, justifyContent:"center", alignItems:"center", padding:24 },
  empty:{ fontSize:18, color:"#666" },

  container:{ padding:16, backgroundColor:"#E3F2FD", minHeight:"100%" },
  title:{ fontSize:24, fontWeight:"bold", marginBottom:24, color:"#0D47A1" },
  card:{ padding:16, borderRadius:16, marginBottom:16, shadowColor:"#000",
         shadowOpacity:0.1, shadowRadius:4 },
  cardText:{ fontSize:18, fontWeight:"600", color:"#0D47A1" },
  status:{ marginTop:8, fontSize:14, color:"#08306B" },
});
