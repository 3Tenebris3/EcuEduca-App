import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
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

const MinigamesScreen = () => {
  const minigames = [
    {
      title: "Trivia",
      icon: <Ionicons name="help-circle-outline" size={30} color="#fff" />,
      color: "#4CAF50",
      onPress: () => router.push("/minigames/trivia-list"),
    },
    {
      title: "Memoriza",
      icon: <MaterialIcons name="memory" size={30} color="#fff" />,
      color: "#FF9800",
      onPress: () => router.push("/minigames/memory-list"), // <- NUEVO
    },
    {
      title: "Elige rápido",
      icon: <MaterialCommunityIcons name="flash" size={30} color="#fff" />,
      color: "#2196F3",
      onPress: () => router.push("/minigames/quickpick-list"),
    },
    {
      title: "Completa la frase",
      icon: <FontAwesome5 name="pencil-alt" size={26} color="#fff" />,
      color: "#9C27B0",
      onPress: () => router.push("/minigames/fillblank-list"),
    },
    {
      title: "Secuencia correcta",
      icon: <Entypo name="flow-line" size={30} color="#fff" />,
      color: "#F44336",
      onPress: () => router.push("/minigames/sequence-list"),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>¡A jugar! 🕹️</Text>
      <Text style={styles.subtitle}>Elige tu minijuego favorito:</Text>

      <View style={styles.cardContainer}>
        {minigames.map((game, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: game.color }]}
            onPress={game.onPress}
          >
            {game.icon}
            <Text style={styles.cardTitle}>{game.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default MinigamesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#E8F5E9",
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
