/* app/rewards/index.tsx */
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  LightSpeedInRight,
  ZoomIn,
} from "react-native-reanimated";

import PrimaryButton from "@/components/ui/PrimaryButton";
import {
  fetchRewards,
  redeemReward,
  Reward,
} from "@/services/reward.service";
import { usePointsStore } from "@/store/points";

export default function RewardsScreen() {
  /* ----- store state ----- */
  const { points, rewards, sync } = usePointsStore();

  /* ----- local state ----- */
  const [defs, setDefs] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ----- fetch defs + claimed ----- */
  const load = useCallback(async () => {
    try {
      const apiResp = await fetchRewards();          // { defs?: Reward[]; claimed?: string[] }
      const newDefs = apiResp?.defs ?? [];
      const claimed = apiResp?.claimed ?? [];

      setDefs(newDefs);
      /* actualiza rewards{} en zustand manualmente */
      usePointsStore.setState({
        rewards: Object.fromEntries(claimed.map((id) => [id, true])),
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudieron cargar las recompensas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* primera carga */
  useEffect(() => {
    void load();
  }, [load]);

  /* loading spinner */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  /* no recompensas configuradas aún */
  if (defs.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={[styles.wrapper, styles.center]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
      >
        <Text style={{ fontSize: 18, color: "#555", textAlign: "center" }}>
          Todavía no hay recompensas disponibles.
        </Text>
        <Text style={{ marginTop: 4, color: "#888", textAlign: "center" }}>
          Desliza hacia abajo para actualizar.
        </Text>
      </ScrollView>
    );
  }

  const maxThreshold = defs[defs.length - 1].threshold;

  return (
    <ScrollView
      contentContainerStyle={styles.wrapper}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      {/* Puntos actuales */}
      <Animated.View entering={LightSpeedInRight.springify()}>
        <Text style={styles.pointsTitle}>Tus puntos</Text>
        <Text style={styles.points}>{points}</Text>
      </Animated.View>

      {/* Barra de progreso */}
      <View style={styles.progressBox}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(points / maxThreshold, 1) * 100}%` },
          ]}
        />
      </View>

      {/* Tarjetas de recompensa */}
      {defs.map((r, idx) => {
        const unlocked = rewards[r.id];
        const canRedeem = points >= r.threshold && !unlocked;

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
                <FontAwesome
                  name="check-circle"
                  size={28}
                  color="#4CAF50"
                />
              </Animated.View>
            )}

            {canRedeem && (
              <PrimaryButton
                title="Canjear"
                small
                onPress={async () => {
                  try {
                    await redeemReward(r.id);
                    await sync();      // actualiza puntos y claimed
                    Alert.alert("¡Listo!", "Recompensa canjeada");
                  } catch {
                    Alert.alert("Ups", "No fue posible canjear");
                  }
                }}
              />
            )}
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

/* ───── styles ───── */
const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#FFF8E1", minHeight: "100%" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  pointsTitle: { fontSize: 20, color: "#6D4C41" },
  points: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 8,
  },
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
