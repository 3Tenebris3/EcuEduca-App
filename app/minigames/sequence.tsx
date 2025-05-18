import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DraggableFlatList, {
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

/* ──────────── Banco de datos ──────────── */
type Item = { id: string; label: string; correctIndex: number };

const BANK: Record<string, Item[]> = {
  seq1: [
    { id: "djoser", label: "Djoser", correctIndex: 0 },
    { id: "keops", label: "Keops", correctIndex: 1 },
    { id: "tut", label: "Tutankamón", correctIndex: 2 },
    { id: "ramses", label: "Ramsés II", correctIndex: 3 },
    { id: "cleopatra", label: "Cleopatra VII", correctIndex: 4 },
  ],
  /* ...seq2, seq3 como antes... */
};

export default function SequenceGame() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const initial = useMemo(
    () => shuffle(BANK[id] || []),
    [id],
  );

  const [data, setData] = useState<Item[]>(initial);

  /* drag & drop */
  const onDragEnd = ({ data: newData }: { data: Item[] }) => {
    setData(newData);
    Haptics.selectionAsync(); // vibración rápida
  };

  /* comprobar */
  const allCorrect = data.every(
    (it, idx) => idx === it.correctIndex,
  );

  const check = () =>
    router.replace({
      pathname: "/minigames/sequence-result",
      params: {
        correct: data.filter((it, idx) => idx === it.correctIndex).length.toString(),
        total: data.length.toString(),
      },
    });

  /* render item */
  const renderItem = ({ item, drag, isActive }: any) => (
    <ScaleDecorator>
      <Animated.View
        entering={FadeInDown.springify().delay(item.correctIndex * 60)}
        exiting={FadeOutUp}
        style={[
          styles.card,
          {
            backgroundColor: isActive ? "#FFF176" : "#FFFDE7",
            transform: [{ scale: isActive ? 1.03 : 1 }],
          },
        ]}
      >
        <Text
          style={styles.label}
          onLongPress={drag}
          selectable={false}
        >
          {item.label}
        </Text>
      </Animated.View>
    </ScaleDecorator>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.instruction}>
        Mantén y arrastra las tarjetas al orden correcto.
      </Text>

      <DraggableFlatList
        data={data}
        keyExtractor={(item) => item.id}
        onDragEnd={onDragEnd}
        renderItem={renderItem}
      />

      <Animated.View
        entering={FadeInDown.delay(400)}
        style={[
          styles.checkBtn,
          { backgroundColor: allCorrect ? "#4CAF50" : "#8D6E63" },
        ]}
      >
        <Text style={styles.checkText} onPress={check}>
          Comprobar
        </Text>
      </Animated.View>
    </View>
  );
}

/* ──────────── helpers ──────────── */
function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ──────────── estilos ──────────── */
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFBE6",
  },
  instruction: { fontSize: 18, color: "#5D4037", marginBottom: 16 },
  card: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D7CCC8",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: { fontSize: 18, color: "#37474F" },
  checkBtn: {
    marginTop: 12,
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  checkText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
