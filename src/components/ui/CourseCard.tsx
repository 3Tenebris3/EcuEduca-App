// components/CourseCard.tsx
import { colors } from "@/theme/colors";
import { Image, Pressable, StyleSheet, Text } from "react-native";

export interface CourseCardProps {
  name: string;
  icon: any;
  onPress: () => void;
}

export default function CourseCard({ name, icon, onPress }: CourseCardProps) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: .8 }]} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.label}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: { width: 40, height: 40, marginRight: 16 },
  label: { fontSize: 18, fontWeight: "600", color: colors.text },
});
