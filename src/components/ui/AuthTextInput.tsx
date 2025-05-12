import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { colors } from "../../theme/colors";

export default function AuthTextInput(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.textLight}
      style={styles.input}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 10,
    marginTop: 12,
    fontSize: 16,
  },
});
