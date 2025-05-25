import { listMemorySets } from "@/services/memory.service";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BoardItem = {
  id:        string;
  title:     string;
  completed: boolean;
  moves?:    number;
  pairs?:    number;
};

export default function MemoryList() {
  const [boards, setBoards]   = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  /* ---- fetch helper ---- */
  const load = useCallback(async () => {
    try {
      const { sets, scores } = await listMemorySets();
      const data: BoardItem[] = sets.map((s) => {
        const sc = scores[s.id];
        return {
          id: s.id,
          title: s.title,
          completed: !!sc,
          moves: sc?.moves,
          pairs: sc?.pairs,
        };
      });
      setBoards(data);
    } catch (e) {
      Alert.alert("Error", "No se pudieron cargar los memoramas");
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => void load(), [load]);

  /* ---- navegación ---- */
  const go = (b: BoardItem) => {
    if (b.completed && b.moves !== undefined && b.pairs !== undefined) {
      router.push({
        pathname: "/minigames/memory-result",
        params: { moves: String(b.moves), pairs: String(b.pairs) },
      });
    } else {
      router.push({ pathname: "/minigames/memory", params: { id: b.id } });
    }
  };

  /* ---- UI ---- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={() => {
          setRefresh(true);
          load();
        }} />
      }
    >
      <Text style={styles.title}>Elige un Memorama 🃏</Text>

      {boards.length === 0 && (
        <Text style={{ textAlign: "center", color: "#666" }}>
          No hay memoramas disponibles.
        </Text>
      )}

      {boards.map((b) => (
        <TouchableOpacity
          key={b.id}
          style={[
            styles.card,
            { backgroundColor: b.completed ? "#C8E6C9" : "#FFECB3" },
          ]}
          onPress={() => go(b)}
        >
          <Text style={styles.cardText}>{b.title}</Text>
          <Text style={styles.status}>
            {b.completed
              ? `✅ Completado · ${b.moves}/${b.pairs}`
              : "⏳ Pendiente"}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

/* ---- estilos ---- */
const styles = StyleSheet.create({
  center:   { flex:1, justifyContent:"center", alignItems:"center" },
  container:{ padding:16, backgroundColor:"#FFF8E1", minHeight:"100%" },
  title:    { fontSize:24, fontWeight:"bold", marginBottom:24, color:"#444" },
  card: {
    padding:16, borderRadius:16, marginBottom:16,
    shadowColor:"#000", shadowOpacity:0.1, shadowRadius:4, elevation:2,
  },
  cardText:{ fontSize:18, fontWeight:"600", color:"#333" },
  status:  { marginTop:8, fontSize:14, color:"#666" },
});
