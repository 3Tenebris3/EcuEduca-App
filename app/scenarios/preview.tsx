import { SCENES } from "@/constants/scenes";
import { openAR } from "@/utils/openAR";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Preview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scene = SCENES.find((s) => s.id === id)!;

  const playAudio = async () => {
    if (!scene.audio) return;
    const { sound } = await Audio.Sound.createAsync(scene.audio);
    sound.playAsync();
  };

  return (
    <View style={styles.wrapper}>
      {/* Simple PNG teaser; could be a WebGL preview if you like */}
      <Image source={scene.preview} style={styles.img} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.title}>{scene.title}</Text>
        <Text style={styles.desc}>{scene.desc}</Text>

        <TouchableOpacity style={styles.btn} onPress={playAudio}>
          <Text style={styles.btnTxt}>Escuchar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#4CAF50" }]}
          onPress={() => openAR(scene.glbUrl, scene.title)}
        >
          <Text style={styles.btnTxt}>Ver en AR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F1F8E9" },
  img: { width: "100%", height: "55%" },
  info: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#33691E",
  },
  desc: { fontSize: 16, color: "#4E342E", marginBottom: 16 },
  btn: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  btnTxt: { color: "#fff", fontWeight: "600", textAlign: "center" },
});
