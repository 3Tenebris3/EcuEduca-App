import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  avatarSrc,
  Row
} from "../../src/services/leaderboard.service";
import { colors } from "../../src/theme/colors";

/* fallback de prueba */
const MOCK: Row[] = [
  { id: "1", avatar: "avatar2.png", name: "Ana", points: 345, rank: 1 },
  { id: "2", avatar: "avatar7.png", name: "Beto", points: 330, rank: 2 },
  { id: "3", avatar: "avatar14.png", name: "Carlos", points: 310, rank: 3 },
  { id: "4", avatar: "avatar1.png", name: "Diana", points: 295, rank: 4 },
  { id: "5", avatar: "avatar9.png", name: "Elena", points: 280, rank: 5 },
];

export default function LeaderboardScreen() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setRows(MOCK);
        //const apiRows = await fetchLeaderboard();
        //setRows(apiRows.length ? apiRows : MOCK);
      } catch {
        setRows(MOCK);
      }
    })();
  }, []);

  /* separa top-3 y el resto */
  const podium = rows.slice(0, 3);
  const reorderedPodium = [podium[1], podium[0], podium[2]];
  const others = rows.slice(3);

  return (
    <>
      <LinearGradient
        colors={["#ffd86f", "#ff9d47"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FontAwesome5 name="trophy" size={28} color="#fff" />
        <Text style={styles.headerText}>Tabla de Puntuación</Text>
      </LinearGradient>

      {/* ---------- PODIO ---------- */}
      {podium.length === 3 && (
        <View style={styles.podiumWrap}>
          {reorderedPodium.map((p, i) => (
            <PodiumColumn key={p.id} data={p} index={i} />
          ))}
        </View>
      )}

      {/* ---------- RESTO ---------- */}
      <FlatList
        data={others}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => <RowItem item={item} />}
      />
    </>
  );
}

/* ――― Componentes auxiliares ――― */

function PodiumColumn({ data, index }: { data: Row; index: number }) {
  const bg = ["#D6D6D6", "#FFD700", "#C4904E"][index];

  const columnStyle = [
    styles.podiumCol,
    index === 1 && styles.podiumMid,
  ];

  return (
    <View style={columnStyle}>
      {index === 1 && <FontAwesome5 name="crown" size={28} color="#FFD700" style={{ bottom: 6 }} />}
      <Image source={avatarSrc(data.avatar)} style={[styles.podiumAvatar, { borderColor: bg }]} />
      <Text numberOfLines={1} style={styles.podiumName}>{data.name}</Text>
      <Text style={styles.podiumPts}>{data.points}</Text>
    </View>
  );
}

function RowItem({ item }: { item: Row }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>{item.rank}</Text>
      <Image source={avatarSrc(item.avatar)} style={styles.avatar} />
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.pointsBubble}>
        <Text style={styles.pointsText}>{item.points}</Text>
      </View>
    </View>
  );
}

/* ――― STYLES ――― */
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },

  /* podium */
  podiumWrap: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  podiumCol: {
    alignItems: "center",
    width: width / 4,
  },
  podiumMid: { marginBottom: 12 }, // centro más alto
  podiumAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    marginBottom: 4,
  },
  podiumName: { fontWeight: "600", maxWidth: "100%", textAlign: "center" },
  podiumPts: { fontWeight: "700", color: colors.primary },

  /* lista */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  rank: { width: 28, fontWeight: "700" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 8 },
  name: { flex: 1 },
  pointsBubble: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: width * 0.18,
    alignItems: "center",
  },
  pointsText: { color: "#fff", fontWeight: "700" },
});
