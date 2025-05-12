import { extractApiError } from "@/utils/error.util";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AuthTextInput from "../../src/components/ui/AuthTextInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import { register } from "../../src/services/auth.service";
import { useAuthStore } from "../../src/store/useAuthStore";
import { colors } from "../../src/theme/colors";

export default function RegisterScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    try {
      setLoading(true);
      const user = await register({ displayName, email, password, role: 'student' });
      setUser(user);
      router.replace("/(tabs)");
    } catch (e: any) {
      setErrorMessage(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <AuthTextInput placeholder="Nombre" value={displayName} onChangeText={setDisplayName} />
      <AuthTextInput
        placeholder="Correo"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <AuthTextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <PrimaryButton
        title="Registrarme"
        onPress={handleRegister}
        loading={loading}
      />
      <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
        <Text style={styles.switch}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
      {errorMessage !== "" && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: colors.text,
  },
  switch: {
    textAlign: "center",
    marginTop: 16,
    color: colors.primaryDark,
  },
  error: { color: colors.error, textAlign: "center", marginTop: 8 },
});
