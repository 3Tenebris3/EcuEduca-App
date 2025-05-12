import AppHeader from "@/components/layout/AppHeader";
import { AppText, Screen } from "@/components/layout/Screen";
import ActivityButton from "@/components/ui/ActivityButton";
import { getModules, ModuleDto } from "@/services/module.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Activities() {
  const { cid, uid } = useLocalSearchParams<{ cid: string; uid: string }>();
  const [mods, setMods] = useState<ModuleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getModules(cid!, uid!).then((m) => {
      setMods(m);
      setLoading(false);
    });
  }, []);

  const has = (t: ModuleDto["type"]) => mods.some((m) => m.type === t);

  if (loading)
    return (
      <Screen>
        <AppHeader title="Actividades" back />
        <ActivityIndicator style={{ flex: 1 }} />
      </Screen>
    );

  const current = mods.reduce<Record<ModuleDto["type"], ModuleDto | undefined>>(
    (acc, m) => ({ ...acc, [m.type]: m }),
    { quiz: undefined, minigame: undefined, "3d": undefined }
  );

  return (
    <Screen>
      <AppHeader title="Actividades" back />
      <View style={styles.row}>
        <ActivityButton
          icon={require("../../../../assets/images/3d.png")}
          label="RA / 3D"
          disabled={!has("3d")}
          onPress={() =>
            router.push({
              pathname: "/viewer",
              params: { rid: current["3d"]?.refId },
            })
          }
        />
        <ActivityButton
          icon={require("../../../../assets/images/gamepad.png")}
          label="Minijuego"
          disabled={!has("minigame")}
          onPress={() =>
            router.push({
              pathname: "/game",
              params: { gid: current["minigame"]?.refId },
            })
          }
        />
        <ActivityButton
          icon={require("../../../../assets/images/quiz.png")}
          label="Quiz"
          disabled={!has("quiz")}
          onPress={() =>
            router.push({
              pathname: "/quiz",
              params: { qid: current["quiz"]?.refId },
            })
          }
        />
      </View>
      {!mods.length && (
        <AppText style={{ textAlign: "center", marginTop: 40 }}>
          Esta unidad aún no tiene actividades.
        </AppText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
});
