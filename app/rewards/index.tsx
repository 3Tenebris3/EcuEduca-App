import { REWARDS } from "@/constants/rewards";
import { usePointsStore } from "@/store/points";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
    FadeInDown,
    LightSpeedInRight,
    ZoomIn,
} from "react-native-reanimated";

export default function RewardsScreen() {
  const points = usePointsStore((s) => s.points);

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {/* Header */}
      <Animated.View entering={LightSpeedInRight.springify()}>
        <Text style={styles.pointsTitle}>Tus puntos</Text>
        <Text style={styles.points}>{points}</Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.progressBox}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(points / REWARDS[REWARDS.length - 1].threshold, 1) * 100}%` },
          ]}
        />
      </View>

      {/* Reward cards */}
      {REWARDS.map((r, idx) => {
        const unlocked = points >= r.threshold;
        return (
          <Animated.View
            key={r.id}
            entering={FadeInDown.delay(idx * 80)}
            style={[
              styles.card,
              { backgroundColor: unlocked ? "#C8E6C9" : "#FFECB3" },
            ]}
          >
            <Text style={styles.icon}>{r.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.threshold}>
                {unlocked ? "¡Desbloqueado!" : `${r.threshold} pts`}
              </Text>
            </View>

            {unlocked && (
              <Animated.View entering={ZoomIn}>
                <FontAwesome name="check-circle" size={28} color="#4CAF50" />
              </Animated.View>
            )}
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

/* ───── styles ───── */
const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: "#FFF8E1",
    minHeight: "100%",
  },
  pointsTitle: { fontSize: 20, color: "#6D4C41" },
  points: { fontSize: 40, fontWeight: "bold", color: "#4E342E", marginBottom: 8 },
  progressBox: {
    height: 10,
    width: "100%",
    backgroundColor: "#DDD",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressFill: { height: "100%", backgroundColor: "#FF7043" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: { fontSize: 36, marginRight: 16 },
  label: { fontSize: 18, fontWeight: "600", color: "#3E2723" },
  threshold: { fontSize: 14, color: "#5D4037" },
});
