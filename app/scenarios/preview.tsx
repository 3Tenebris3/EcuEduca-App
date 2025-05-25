import { SCENES } from "@/constants/scenes";
import { openAR } from "@/utils/openAR";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  const scene = SCENES.find((s) => s.id === id);

  const [loadingSound, setLoadingSound] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // ───────────────────────────────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────────────────────────────
  const playAudio = async () => {
    if (!scene?.audio) return;
    try {
      setLoadingSound(true);
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(scene.audio);
        soundRef.current = sound;
      }
      await soundRef.current!.replayAsync();
    } finally {
      setLoadingSound(false);
    }
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        (async () => {
          if (soundRef.current) {
            await soundRef.current.unloadAsync();
          }
        })();
      }
    };
  }, []);

  if (!scene) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <Text>Escena no encontrada.</Text>
      </SafeAreaView>
    );
  }

  // ───────────────────────────────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.wrapper}>
      {/* HERO IMAGE */}
      <Image source={scene.preview} style={styles.hero} resizeMode="cover" />

      {/* DESCRIPTION */}
      <ScrollView
        style={styles.textBox}
        contentContainerStyle={{ paddingBottom: 88 }} // leave room for bar
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{scene.title}</Text>
        {scene.desc.split("\n").map((para, i) => (
          <Text style={styles.desc} key={i}>
            {para.trim()}
          </Text>
        ))}
      </ScrollView>

      {/* ACTION BAR */}
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={playAudio} style={styles.iconBtn}>
          {loadingSound ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="volume-high" size={28} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openAR(scene.glbUrl, scene.title)}
          style={[styles.iconBtn, { backgroundColor: "#FFB300" }]}
        >
          <Icon name="cube-scan" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#FFFBEA",
  card: "#FFECB3",
  primary: "#4FC3F7",
  accent: "#FFB300",
  text: "#3E2723",
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.bg },
  hero: {
    width: "90%",
    height: "40%",
    alignSelf: "center",
    marginTop: 12,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  textBox: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  desc: {
    fontSize: 17,
    lineHeight: 26,
    color: COLORS.text,
    marginBottom: 10,
    textAlign: "justify",
  },

  // action bar hovers at bottom
  actionBar: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  iconBtn: {
    backgroundColor: COLORS.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
});
