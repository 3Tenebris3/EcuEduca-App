import { colors } from "@/theme/colors";
import { ReactNode } from "react";
import {
  Text as RNText,
  SafeAreaView,
  StyleSheet,
  TextProps,
  View,
  ViewStyle,
} from "react-native";

/* ──────────────── Contenedor con safe-area ──────────────── */
interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.flex, style]}>{children}</View>
    </SafeAreaView>
  );
}

/* ──────────────── Tipografía base ──────────────── */
export const AppText = ({
  children,
  fontSize = 16,
  style,
  ...rest
}: TextProps & { fontSize?: number }) => (
  <RNText style={[{ fontSize, color: colors.text }, style]} {...rest}>
    {children}
  </RNText>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
});
