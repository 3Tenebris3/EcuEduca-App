import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

export const openAR = async (glbUrl: string, title: string) => {
  if (Platform.OS !== "android") return;

  // 1) URL normal que Chrome entiende
  const sceneUrl =
    "https://arvr.google.com/scene-viewer/1.0" +
    `?file=${encodeURIComponent(glbUrl)}` +
    `&title=${encodeURIComponent(title)}` +
    `&mode=ar_only`;

  try {
    await Linking.openURL(sceneUrl);
    return; // abrió con Chrome → Scene Viewer
  } catch {
    /* Chrome no disponible o bloqueado → intent manual */
  }

  // 2) Intent explícito (requiere Google app)
  const intent =
    `intent://arvr.google.com/scene-viewer/1.0` +
    `?file=${encodeURIComponent(glbUrl)}` +
    `&mode=ar_only` +
    `&title=${encodeURIComponent(title)}` +
    `#Intent;scheme=https;package=com.google.android.googlequicksearchbox;end`;

  try {
    await IntentLauncher.startActivityAsync(
      "android.intent.action.VIEW",
      { data: intent }
    );
    return;
  } catch {
    /* Nada funcionó → alerta */
    alert(
      "Este dispositivo no puede abrir Scene Viewer.\n" +
        "Instala o actualiza:\n" +
        "• Google (app)\n" +
        "• Servicios de Google Play para RA"
    );
  }
};
