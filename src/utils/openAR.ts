// utils/openAR.ts
import * as Linking from "expo-linking";

export const openAR = (glbUrl: string, title: string) => {
  const intent = `intent://arvr.google.com/scene-viewer/1.1` +
    `?file=${encodeURIComponent(glbUrl)}` +
    `&mode=ar_only` +
    `&title=${encodeURIComponent(title)}` +
    `#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
      glbUrl
    )};end`;

  Linking.openURL(intent).catch(() =>
    alert("Parece que este dispositivo no soporta ARCore.")
  );
};
