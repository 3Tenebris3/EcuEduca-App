/* app/minigames/fillblank/index.tsx */
import { FBSetMeta, listFBsets } from "@/services/fillblank.service";
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

export default function FillBlankList() {
  const [sets, setSets]         = useState<FBSetMeta[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refresh, setRefresh]   = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await listFBsets();     // [{id,title,total,completed,score}]
      setSets(data);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los retos");
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => void load(), [load]);

  const go = (s: FBSetMeta) => {
    if (s.completed) {
      router.push({
        pathname: "/minigames/fillblank-result",
        params: { score: String(s.score), total: String(s.total) },
      });
    } else {
      router.push({ pathname: "/minigames/fillblank", params: { id: s.id } });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (sets.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={[styles.container, styles.center]}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => {
            setRefresh(true);
            load();
          }} />
        }
      >
        <Text style={{ color: "#666" }}>Aún no hay retos disponibles.</Text>
      </ScrollView>
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
      <Text style={styles.title}>Elige un reto de Historia 📜</Text>

      {sets.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={[
            styles.card,
            { backgroundColor: s.completed ? "#C8E6C9" : "#FFE0B2" },
          ]}
          onPress={() => go(s)}
        >
          <Text style={styles.cardText}>{s.title}</Text>
          <Text style={styles.status}>
            {s.completed
              ? `✅ Completado · ${s.score}/${s.total}`
              : `⏳ Pendiente · ${s.total} preguntas`}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container:{ padding:16, backgroundColor:"#FFF8E1", minHeight:"100%" },
  center:{ flex:1, justifyContent:"center", alignItems:"center" },

  title:{ fontSize:24, fontWeight:"bold", marginBottom:24, color:"#444" },
  card:{ padding:16, borderRadius:16, marginBottom:16,
         shadowColor:"#000", shadowOpacity:0.1, shadowRadius:4, elevation:2 },
  cardText:{ fontSize:18, fontWeight:"600", color:"#333" },
  status:{ marginTop:6, fontSize:14, color:"#666" },
});
