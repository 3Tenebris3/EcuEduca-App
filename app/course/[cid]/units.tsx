import AppHeader from "@/components/layout/AppHeader";
import { AppText, Screen } from "@/components/layout/Screen";
import { getUnits, UnitDto } from "@/services/unit.service";
import { colors } from "@/theme/colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

export default function UnitsScreen() {
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const [units, setUnits] = useState<UnitDto[]>([]);
  const [loading, setLoading] = useState(true);
  const groupId = `g-${cid}`;

  useEffect(() => {
    getUnits(groupId).then((u) => {
      setUnits(u.sort((a, b) => a.order - b.order));
      setLoading(false);
    });
  }, [groupId]);

  if (loading) {
    return (
      <Screen>
        <AppHeader title="Unidades" back />
        <ActivityIndicator style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader title="Unidades" back />

      <FlatList
        data={units}
        keyExtractor={(u) => u.id}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: colors.border }} />
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/course/[cid]/[uid]/activities",
                params: { cid, uid: item.id },
              })
            }
          >
            <AppText fontSize={16} style={{ padding: 18 }}>
              {item.order}. {item.title}
            </AppText>
          </Pressable>
        )}
      />
    </Screen>
  );
}
