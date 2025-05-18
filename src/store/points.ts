import { create } from "zustand";

interface PointsState {
  points: number;
  addPoints: (n: number) => void;
  reset: () => void;
}

export const usePointsStore = create<PointsState>((set) => ({
  points: 0,                   // ← start value; update from minigames
  addPoints: (n) => set((s) => ({ points: s.points + n })),
  reset:    () => set({ points: 0 }),
}));
