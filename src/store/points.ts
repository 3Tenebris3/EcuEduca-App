import { fetchRewards } from "@/services/reward.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PointsState {
  points: number;
  rewards: Record<string, boolean>;
  sync: () => Promise<void>;
  updatePoints: (n: number) => void;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      points: 0,
      rewards: {},
      sync: async () => {
        const res = await fetchRewards();
        set({
          rewards: Object.fromEntries(res.claimed.map((id) => [id, true])),
        });
      },
      updatePoints: (n) => set({ points: n }),
    }),
    { name: "ecueduca-points" }
  )
);
