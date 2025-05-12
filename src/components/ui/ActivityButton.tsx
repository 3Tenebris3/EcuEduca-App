import { AppText } from "@/components/layout/Screen";
import { Image, Pressable, StyleSheet, ViewStyle } from "react-native";

interface Props {
  icon: any;              // require(...)
  label: string;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function ActivityButton({ icon, label, disabled, onPress, style }: Props) {
  return (
    <Pressable
      style={[
        styles.card,
        disabled && styles.disabled,
        style,
      ]}
      onPress={disabled ? undefined : onPress}
    >
      <Image source={icon} style={styles.icon} />
      <AppText fontSize={15} style={{ fontWeight: "600" }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  disabled: { opacity: 0.35 },
  icon: { width: 48, height: 48, marginBottom: 6 },
});
