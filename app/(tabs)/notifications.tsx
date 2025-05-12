import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Screen } from "../../src/components/layout/Screen";
import {
  deleteNotification,
  getNotifications,
  Notification
} from "../../src/services/notification.service";
import { useAuthStore } from "../../src/store/useAuthStore";
import { colors } from "../../src/theme/colors";

/* ------------ fallback mock ------------ */
const MOCK: Notification[] = [
  {
    id: "a",
    title: "¡Tarea de matemáticas!",
    body: "Recuerda resolver la hoja 4.",
    date: new Date().toISOString(),
    type: "warning",
    read: false,
  },
  {
    id: "b",
    title: "Premio",
    body: "¡Ganaste 50 puntos por completar el quiz!",
    date: new Date().toISOString(),
    type: "reward",
    read: true,
  },
];

export default function NotificationsScreen() {
  const { user } = useAuthStore();
  const [list, setList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  /* fetch inicial */
  useEffect(() => {
    (async () => {
      try {
        const apiList = await getNotifications();
        setList(apiList.length ? apiList : MOCK);
      } catch {
        setList(MOCK);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* swipe-delete handler */
  const handleDelete = async (id: string) => {
    try {
      setList((l) => l.filter((n) => n.id !== id)); // optimista
      await deleteNotification(id);
    } catch {
      Alert.alert("Error", "No se pudo eliminar");
    }
  };

  /* crear notificación rápida mock */
  const handleCreate = async () => {
    const dummy = {
      userId: user?.id ?? "",
      title: "Mensaje nuevo",
      body: "¡Hola mundo!",
      type: "info" as const,
    };
    setList((l) => [
      { ...dummy, id: Date.now().toString(), date: new Date().toISOString(), read: false },
      ...l,
    ]);
    // await createNotification(dummy); // cuando el backend esté listo
  };

  /* ícono según type */
  const typeIcon = (t: Notification["type"]) => {
    switch (t) {
      case "info":
        return <Ionicons name="information-circle" size={24} color="#007bff" />;
      case "warning":
        return <Ionicons name="alert" size={24} color="#ff9800" />;
      case "reward":
        return <Ionicons name="star" size={24} color="#ffc107" />;
    }
  };

  /* render fila */
  const renderItem = ({ item }: { item: Notification }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    >
      <View style={[styles.row, !item.read && styles.unread]}>
        {typeIcon(item.type)}
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
    </Swipeable>
  );

  if (loading) {
    return (
      <Screen style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </Screen>
    );
  }

  return (
    <>
      <Text style={styles.headerTitulo}>Notificaciones</Text>
      <FlatList
        data={list}
        keyExtractor={(n) => n.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            Sin notificaciones
          </Text>
        }
      />

      {/* FAB crear */}
      {(user?.roles?.includes("teacher") || user?.roles?.includes("admin")) && (
        <TouchableOpacity style={styles.fab} onPress={handleCreate}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}
    </>
  );
}

/* ------------ styles ------------ */
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
  },
  unread: { backgroundColor: "#eaf4ff" },
  title: { fontWeight: "700", fontSize: 15 },
  body: { color: "#555" },
  date: { fontSize: 12, color: "#999" },
  sep: { height: 1, backgroundColor: "#eee", marginLeft: 54 },
  deleteBtn: {
    width: 72,
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  headerTitulo: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "left",
    marginTop: 8,
    marginLeft: 30,
    marginBottom: 4,
  },  
});
