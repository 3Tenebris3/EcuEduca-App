import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 6;                      // ↓ márgenes más pequeños
const CARD_SIZE = (width - CARD_MARGIN * 10) / 4; // 4 cartas por fila

type CardContent =
  | { type: "emoji"; value: string }
  | { type: "image"; value: any };

type Card = CardContent & {
  id: number;
  flipped: boolean;
  matched: boolean;
  anim: Animated.Value;
};

const CONTENT: CardContent[] = [
  { type: "emoji", value: "🐶" },
  { type: "emoji", value: "🐱" },
  { type: "emoji", value: "🐰" },
  { type: "emoji", value: "🐼" },
  { type: "emoji", value: "🦊" },
  { type: "emoji", value: "🦄" },
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function MemoryGame() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);

  /* crear mazo */
  useEffect(() => {
    const duplicated = [...CONTENT, ...CONTENT];
    const deck = shuffle(duplicated).map<Card>((item, idx) => ({
      ...item,
      id: idx,
      flipped: false,
      matched: false,
      anim: new Animated.Value(0),
    }));
    setCards(deck);
    setSelected([]);
    setMoves(0);
    setPairsFound(0);
  }, [id]);

  /* tap */
  const onTap = (card: Card) => {
    if (card.flipped || card.matched || selected.length === 2) return;

    flip(card, 1);
    const newSel = [...selected, { ...card, flipped: true }];
    setSelected(newSel);

    if (newSel.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSel;
      if (a.value === b.value && a.type === b.type) {
        setPairsFound((p) => p + 1);
        setCards((prev) =>
          prev.map((c) =>
            c.value === a.value && c.type === a.type
              ? { ...c, matched: true }
              : c,
          ),
        );
        setSelected([]);
      } else {
        setTimeout(() => {
          flip(a, 0);
          flip(b, 0);
          setSelected([]);
        }, 850);
      }
    }
  };

  const flip = (card: Card, to: 0 | 1) => {
    Animated.timing(card.anim, {
      toValue: to,
      duration: 300,
      useNativeDriver: true,
    }).start(() =>
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, flipped: to === 1 } : c)),
      ),
    );
  };

  /* detectar fin */
  useEffect(() => {
    if (pairsFound === CONTENT.length && CONTENT.length) {
      setTimeout(() => {
        router.replace({
          pathname: "/minigames/memory-result",
          params: { moves: moves.toString(), pairs: CONTENT.length.toString() },
        });
      }, 650);
    }
  }, [pairsFound]);

  /* render */
  return (
    <View style={styles.wrapper}>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Pares: {pairsFound}/{CONTENT.length}
        </Text>
        <Text style={styles.statusText}>Movimientos: {moves}</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => {
          const rotateY = card.anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"],
          });

          return (
            <TouchableWithoutFeedback key={card.id} onPress={() => onTap(card)}>
              <Animated.View
                style={[
                  styles.card,
                  { transform: [{ perspective: 1000 }, { rotateY }] },
                ]}
              >
                {/* reverso */}
                <View style={[styles.face, styles.backFace]}>
                  <Text style={styles.qmark}>?</Text>
                </View>

                {/* anverso */}
                <View
                  style={[
                    styles.face,
                    styles.frontFace,
                    { transform: [{ rotateY: "180deg" }] },
                  ]}
                >
                  {card.type === "emoji" ? (
                    <Text style={styles.emoji}>{card.value}</Text>
                  ) : (
                    <Image
                      source={card.value}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
}

/* estilos */
const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 16, backgroundColor: "#EDF2FF" },

  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  statusText: { fontSize: 16, color: "#37474F", fontWeight: "600" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: CARD_MARGIN,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
    backfaceVisibility: "hidden",
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",      // ← OCULTA cara posterior
  },
  backFace: { backgroundColor: "#90CAF9" },
  frontFace: { backgroundColor: "#FFF59D" },

  qmark: { fontSize: 32, color: "#fff", fontWeight: "bold" },
  emoji: { fontSize: 34 },
  image: { width: "70%", height: "70%" },
});
