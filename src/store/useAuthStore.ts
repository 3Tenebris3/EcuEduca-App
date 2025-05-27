/* src/store/useAuthStore.ts */
import { User } from "@/types/user"; // tu modelo
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (u) => set({ user: u }),

      logout: async () => {
        /* borra token y limpia estado */
        await SecureStore.deleteItemAsync("token");
        set({ user: null });
      },
    }),
    {
      name: "ecueduca-auth",               // clave
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }), // sólo guardamos user
    },
  ),
);
