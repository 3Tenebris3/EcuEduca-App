import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


const { width } = Dimensions.get("window");

const IndexScreen = () => {
  const userName = "Andrés"; // ← Puedes cambiar esto dinámicamente más adelante

  const sections = [
    {
      title: "Escenarios",
      icon: <Ionicons name="planet" size={30} color="#fff" />,
      color: "#4CAF50",
      onPress: () => console.log("Ir a Escenarios"),
    },
    {
      title: "Minijuegos",
      icon: <FontAwesome5 name="gamepad" size={26} color="#fff" />,
      color: "#FF9800",
      onPress: () => router.push("/minigames"),
    },    
    {
      title: "Cuestionarios",
      icon: <MaterialCommunityIcons name="file-question-outline" size={30} color="#fff" />,
      color: "#2196F3",
      onPress: () => console.log("Ir a Cuestionarios"),
    },
    {
      title: "Recompensas",
      icon: <Ionicons name="gift-outline" size={30} color="#fff" />,
      color: "#9C27B0",
      onPress: () => console.log("Ir a Recompensas"),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>¡Hola, {userName}! 👋</Text>
      <Text style={styles.subtitle}>¿Qué te gustaría explorar hoy?</Text>

      <View style={styles.cardContainer}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: section.color }]}
            onPress={section.onPress}
          >
            {section.icon}
            <Text style={styles.cardTitle}>{section.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FDF6EC",
    minHeight: "100%",
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    color: "#555",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (width - 48) / 2,
    height: 120,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
