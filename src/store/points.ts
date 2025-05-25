import { fetchRewards } from "@/services/reward.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PointsState {
  points: number;                          // total acumulado
  rewards: Record<string, boolean>;        // id → reclamado
  sync: () => Promise<void>;               // refresca rewards (y puntos si lo añades)
  updatePoints: (delta: number) => void;   // ⬅️  suma puntos GANADOS
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      points: 0,
      rewards: {},

      /* --- sincronizar recompensas --- */
      async sync() {
        const res = await fetchRewards();
        set({
          rewards: Object.fromEntries(res.claimed.map((id) => [id, true])),
          // Si algún día devuelves puntos en el mismo endpoint:
          // points: res.points ?? get().points,
        });
      },

      /* --- sumar puntos ganados --- */
      updatePoints(delta) {
        set({ points: get().points + delta });
      },
    }),
    { name: "ecueduca-points" }
  )
);
