import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../theme/colors";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  small = false,
}: Props) {
  const btnDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        small && { opacity: btnDisabled ? 0.6 : 1 },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={btnDisabled}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 30,          // era 4
    alignItems: "center",
    marginTop: 12,
  },
  text: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  smallBtn: {
    paddingVertical: 10,   // small variant
  },    
});
