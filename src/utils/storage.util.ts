import * as SecureStore from "expo-secure-store";

/** Siempre guarda como string */
export async function saveSecure(key: string, value: any) {
  await SecureStore.setItemAsync(key, String(value));
}

export async function getSecure(key: string) {
  return SecureStore.getItemAsync(key); // string | null
}

export async function deleteSecure(key: string) {
  await SecureStore.deleteItemAsync(key);
}
