import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000",
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------- LOG de salida --------
api.interceptors.request.use((config) => {
  console.log(
    `➡️ [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`,
    config.data ?? ""
  );
  return config;
});

// -------- LOG de entrada -------d-
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ [${response.status}] ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    if (error.response) {
      console.log(
        `❌ [${error.response.status}] ${error.config.url}`,
        error.response.data
      );
    } else {
      console.log(`❌ [Network]`, error.message);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { status, data } = err.response ?? {};
   if (status === 401 && data?.error?.details?.startsWith("Token inválido")) {
      const message = err.response.data?.message ?? "Token inválido";
      console.log("⚠️ 401:", message);

      // Limpia store + SecureStore
      const SecureStore = await import("expo-secure-store");
      await SecureStore.deleteItemAsync("token");

      const { useAuthStore } = await import("../store/useAuthStore");
      useAuthStore.getState().setUser(null);
    }
    return Promise.reject(err);
  }
);


export default api;
