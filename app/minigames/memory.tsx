/* app/minigames/memory/index.tsx */
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  getMemoryPairs,
  MemoryPair,
  submitMemory,
} from "@/services/memory.service";
import { usePointsStore } from "@/store/points";

/* ── Layout helpers ──────────────────────────────────────────────────── */
const CARD_MARGIN = 8;
const STATUS_BAR_H = 64;

const getLayout = () => {
  const { width, height } = Dimensions.get("window");
  const isPortrait = height >= width;
  const cols = isPortrait ? 3 : 4;
  const cardW = (width - CARD_MARGIN * (cols * 2 + 2)) / cols;
  const cardH = cardW * 1.25;
  return { cardW, cardH };
};

/* ── Tipos ───────────────────────────────────────────────────────────── */
type Card =
  | { pairId: string; type: "text"; label: string }
  | { pairId: string; type: "image"; imgUrl: string };

type DeckCard = Card & {
  id: number;
  flipped: boolean;
  matched: boolean;
  anim: Animated.Value;
};

/* barajar */
const shuffle = <T,>(arr: T[]) => arr.slice().sort(() => Math.random() - 0.5);

/* ─────────────────────────────────────────────────────────────────────── */
export default function MemoryGame() {
  const { id } = useLocalSearchParams<{ id: string }>(); // setId

  const [{ cardW, cardH }, setLayout] = useState(getLayout());
  const [pairs, setPairs]   = useState<MemoryPair[]>([]);
  const [cards, setCards]   = useState<DeckCard[]>([]);
  const [sel, setSel]       = useState<DeckCard[]>([]);
  const [moves, setMoves]   = useState(0);
  const [found, setFound]   = useState(0);
  const [loading, setLoading] = useState(true);

  const addPoints = usePointsStore((s) => s.updatePoints);

  /* rehacer layout en rotación */
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", () =>
      setLayout(getLayout())
    );
    return () => sub?.remove();
  }, []);

  /* cargar pares */
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getMemoryPairs(id);
        if (!mounted) return;

        setPairs(data);
        /* crear deck */
        const raw: Card[] = data.flatMap((p) => [
          { pairId: p.id, type: "text", label: p.name },
          { pairId: p.id, type: "image", imgUrl: p.imgUrl },
        ]);

        const deck = shuffle(raw).map<DeckCard>((c, i) => ({
          ...c,
          id: i,
          flipped: false,
          matched: false,
          anim: new Animated.Value(0),
        }));

        setCards(deck);
        setMoves(0);
        setSel([]);
        setFound(0);
      } catch {
        Alert.alert("Error", "No se pudo cargar el minijuego", [
          { text: "Volver", onPress: () => router.back() },
        ]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* helpers ------------------------------------------------------------- */
  const flip = (card: DeckCard, to: 0 | 1) => {
    Animated.timing(card.anim, {
      toValue: to,
      duration: 350,
      useNativeDriver: true,
    }).start(() =>
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, flipped: to === 1 } : c))
      )
    );
  };

  const onTap = (card: DeckCard) => {
    if (loading || card.flipped || card.matched || sel.length === 2) return;

    flip(card, 1);
    const newSel = [...sel, { ...card, flipped: true }];
    setSel(newSel);

    if (newSel.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSel;
      const match = a.pairId === b.pairId && a.type !== b.type;

      if (match) {
        setFound((p) => p + 1);
        setCards((prev) =>
          prev.map((c) =>
            c.pairId === a.pairId ? { ...c, matched: true } : c
          )
        );
        setSel([]);
      } else {
        setTimeout(() => {
          flip(a, 0);
          flip(b, 0);
          setSel([]);
        }, 900);
      }
    }
  };

  /* fin de partida */
  useEffect(() => {
    if (!loading && found === pairs.length && pairs.length) {
      (async () => {
        try {
          const res = await submitMemory(id, moves); // {gained}
          addPoints(res.gained);
        } catch (_) {/* silencioso */}
        router.replace({
          pathname: "/minigames/memory-result",
          params: { moves: moves.toString(), pairs: pairs.length.toString() },
        });
      })();
    }
  }, [found]);

  /* render --------------------------------------------------------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Pares {found}/{pairs.length}
        </Text>
        <Text style={styles.statusText}>Movimientos {moves}</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => {
          const rotateY = card.anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"],
          });

          const backOp = card.anim.interpolate({
            inputRange: [0, 0.49, 0.5, 1],
            outputRange: [1, 1, 0, 0],
          });
          const frontOp = card.anim.interpolate({
            inputRange: [0, 0.49, 0.5, 1],
            outputRange: [0, 0, 1, 1],
          });

          return (
            <TouchableWithoutFeedback key={card.id} onPress={() => onTap(card)}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    width: cardW,
                    height: cardH,
                    margin: CARD_MARGIN,
                    transform: [{ perspective: 1000 }, { rotateY }],
                  },
                ]}
              >
                {/* reverso */}
                <Animated.View
                  style={[styles.face, styles.backFace, { opacity: backOp }]}
                >
                  <Text style={styles.qmark}>?</Text>
                </Animated.View>

                {/* anverso */}
                <Animated.View
                  style={[
                    styles.face,
                    styles.frontFace,
                    { opacity: frontOp, transform: [{ rotateY: "180deg" }] },
                  ]}
                >
                  {card.type === "image" ? (
                    <Image
                      source={{ uri: card.imgUrl }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.label}>{card.label}</Text>
                  )}
                </Animated.View>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
}

/* --------------- estilos ---------------- */
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    backgroundColor: "#F7F9FF",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  statusBar: {
    height: STATUS_BAR_H,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  statusText: { fontSize: 16, color: "#37474F", fontWeight: "600" },

  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  card: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: "transparent",
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  backFace: { backgroundColor: "#68A4FF" },
  frontFace: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  qmark: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
  },
  image: { width: "72%", height: "55%" },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 4,
  },
});
