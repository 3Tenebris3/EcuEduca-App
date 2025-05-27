/* app/scenarios/preview.tsx */
import { getScene, SceneDetail } from "@/services/scene.service";
import { openAR } from "@/utils/openAR";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Preview() {
  const { id } = useLocalSearchParams<{ id: string }>();

  /* ---------------- state ---------------- */
  const [scene, setScene]       = useState<SceneDetail | null>(null);
  const [loading, setLoading]   = useState(true);
  const [loadingSound, setLSnd] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  /* ---------------- fetch ---------------- */
  const load = useCallback(async () => {
    try {
      const data = await getScene(id);
      setScene(data);
    } catch {
      // si no existe, volvemos al listado
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  /* ---------------- audio helper ---------------- */
  const playAudio = async () => {
    if (!scene?.audioUrl) return;
    try {
      setLSnd(true);
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: scene.audioUrl },
        );
        soundRef.current = sound;
      }
      await soundRef.current!.replayAsync();
    } finally {
      setLSnd(false);
    }
  };

  /* free memory on unmount */
  useEffect(() => () => {
    soundRef.current?.unloadAsync().catch(() => {});
  }, []);

  /* ---------------- AR handler ---------------- */
  const handleAR = async () => {
    if (!scene) return;
   // await saveScenarioProgress(scene.id).catch(console.error);
    openAR(scene.glbUrl, scene.title);
  };

  /* ---------------- loading ---------------- */
  if (loading)
    return (
      <SafeAreaView style={[styles.wrapper, styles.center]}>
        <ActivityIndicator />
      </SafeAreaView>
    );

  if (!scene)
    return (
      <SafeAreaView style={[styles.wrapper, styles.center]}>
        <Text>Escena no encontrada.</Text>
      </SafeAreaView>
    );

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Miniatura */}
      <Image source={{ uri: scene.preview }} style={styles.hero} />

      {/* Texto */}
      <ScrollView
        style={styles.textBox}
        contentContainerStyle={{ paddingBottom: 88 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{scene.title}</Text>
        {scene.desc.split("\n").map((p, i) => (
          <Text style={styles.desc} key={i}>{p.trim()}</Text>
        ))}
      </ScrollView>

      {/* Barra de acción */}
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={playAudio} style={styles.iconBtn}>
          {loadingSound
            ? <ActivityIndicator color="#fff" />
            : <Icon name="volume-high" size={28} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAR}
          style={[styles.iconBtn, { backgroundColor: "#FFB300" }]}
        >
          <Icon name="cube-scan" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- styles (sin cambios) ---------------- */
const COLORS = { bg: "#FFFBEA", text: "#3E2723" };
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper:{ flex:1, backgroundColor:COLORS.bg },
  center: { justifyContent:"center", alignItems:"center" },

  hero:{ width:"90%", height:"40%", alignSelf:"center", marginTop:12,
         borderRadius:18, shadowColor:"#000", shadowOpacity:0.15,
         shadowRadius:6, elevation:4 },

  textBox:{ flex:1, marginTop:16, paddingHorizontal:20 },
  title:{ fontSize:24, fontWeight:"700", color:COLORS.text, marginBottom:8 },
  desc:{ fontSize:17, lineHeight:26, color:COLORS.text, marginBottom:10,
         textAlign:"justify" },

  actionBar:{ position:"absolute", bottom:12, left:0, right:0,
              flexDirection:"row", justifyContent:"center", gap:20 },
  iconBtn:{ backgroundColor:"#4FC3F7", width:64, height:64, borderRadius:32,
            alignItems:"center", justifyContent:"center",
            shadowColor:"#000", shadowOpacity:0.25, shadowRadius:4,
            elevation:6 },
});
