import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "./Screen";

interface Props {
  title: string;
  back?: boolean; // ← muestra la flecha
}

export default function AppHeader({ title, back = false }: Props) {
  const navigation = useNavigation();
  return (
    <View style={styles.bar}>
      {back && (
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      )}
      <AppText fontSize={18} style={styles.title}>
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backBtn: { marginRight: 8, padding: 4 },
  title: { fontWeight: "700", flex: 1, textAlign: "center" },
});
