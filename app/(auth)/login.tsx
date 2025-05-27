import AuthTextInput from "@/components/ui/AuthTextInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { login } from "@/services/auth.service";
import { colors } from "@/theme/colors";
import { extractApiError } from "@/utils/error.util";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function LoginScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      setLoading(true);
      const user = await login({ email, password });
      setUser(user);
      console.log(user);
      if (user.role === "teacher") {
        router.replace("/(teacher)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (e: any) {
      // Axios agrupa la respuesta en e.response
      setErrorMessage(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcuEduca</Text>

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

      <PrimaryButton title="Ingresar" onPress={handleLogin} loading={loading} />

      <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
        <Text style={styles.switch}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
      {errorMessage !== "" && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: colors.text,
  },
  switch: {
    textAlign: "center",
    marginTop: 16,
    color: colors.primaryDark,
  },
  error: { color: colors.error, textAlign: "center", marginTop: 8 },
});
