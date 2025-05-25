import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

import {
  getSequenceSet,
  SeqItem,
  submitSequence,
} from "@/services/sequence.service";
import { usePointsStore } from "@/store/points";

/* ――― helper ――― */
const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

export default function SequenceGame() {
  const { id } = useLocalSearchParams<{ id: string }>(); // setId

  const [items, setItems] = useState<SeqItem[]>([]);
  const [loading, setLoading] = useState(true);

  const updatePoints = usePointsStore((s) => s.updatePoints);

  /* -------- cargar set -------- */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const set = await getSequenceSet(id);
        if (!active) return;
        setItems(shuffle(set.items));
      } catch {
        router.back();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  /* -------- drag & drop -------- */
  const onDragEnd = ({ data }: { data: SeqItem[] }) => {
    setItems(data);
    Haptics.selectionAsync();
  };

  const correct = useMemo(
    () => items.filter((it, idx) => idx === it.correctIndex).length,
    [items],
  );
  const allCorrect = items.length > 0 && correct === items.length;

  /* -------- comprobar -------- */
  const check = async () => {
    try {
      const res = await submitSequence(id, correct, items.length);
      updatePoints(res.gained);
      router.replace({
        pathname: "/minigames/sequence-result",
        params: {
          correct: String(correct),
          total:   String(items.length),
          gained:  String(res.gained),
        },
      });
    } catch {
      router.replace({
        pathname: "/minigames/sequence-result",
        params: { correct: String(correct), total: String(items.length) },
      });
    }
  };

  /* -------- render item -------- */
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

  /* -------- loading -------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  /* -------- UI -------- */
  return (
    <View style={styles.wrapper}>
      <Text style={styles.instruction}>
        Mantén y arrastra las tarjetas al orden correcto.
      </Text>

      <DraggableFlatList
        data={items}
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

/* ――― styles ――― */
const styles = StyleSheet.create({
  center:{ flex:1, justifyContent:"center", alignItems:"center" },

  wrapper:{ flex:1, padding:16, backgroundColor:"#FFFBE6" },
  instruction:{ fontSize:18, color:"#5D4037", marginBottom:16 },

  card:{
    padding:16, borderRadius:14, marginBottom:12,
    borderWidth:1, borderColor:"#D7CCC8",
    shadowColor:"#000", shadowOpacity:0.08, shadowRadius:3, elevation:2,
  },
  label:{ fontSize:18, color:"#37474F" },

  checkBtn:{
    marginTop:12, alignSelf:"center",
    paddingVertical:14, paddingHorizontal:28, borderRadius:18,
  },
  checkText:{ color:"#fff", fontSize:16, fontWeight:"600" },
});
