import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  StudentRow,
  adjustPoints,
  getClassPoints,
} from "@/services/points.service";
import { getClasses } from "../../../src/services/class.service";

export default function TeacherPointsScreen() {
  /* ----- state ----- */
  const [classes, setClasses]         = useState<{ id: string; name: string }[]>([]);
  const [classId, setClassId]         = useState<string | null>(null);
  const [rows, setRows]               = useState<StudentRow[]>([]);
  const [loading, setLoading]         = useState(true);

  /* modal ajuste */
  const [open, setOpen]               = useState(false);
  const [selRow, setSelRow]           = useState<StudentRow | null>(null);
  const [delta, setDelta]             = useState<string>("0");
  const [reason, setReason]           = useState("");

  /* ----- fetch clases + primera lista ----- */
  useEffect(() => {
    (async () => {
      try {
        const cls = await getClasses();     // GET /teacher/classes
        setClasses(cls);
        if (cls.length) setClassId(cls[0].id);
      } finally { setLoading(false); }
    })();
  }, []);

  /* ----- fetch puntos al cambiar clase ----- */
  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    (async () => {
      try {
        const list = await getClassPoints(classId);
        setRows(list);
      } finally { setLoading(false); }
    })();
  }, [classId]);

  /* ----- helpers ----- */
  const refreshRow = (studentId: string, newPoints: number) =>
    setRows((r) =>
      r.map((x) => (x.studentId === studentId ? { ...x, points: newPoints } : x))
    );

  /* ----- render fila ----- */
  const renderItem = ({ item }: { item: StudentRow }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.points}>{item.points}</Text>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => {
          setSelRow(item);
          setDelta("0");
          setReason("");
          setOpen(true);
        }}
      >
        <Ionicons name="add-circle" size={24} color="#4FC3F7" />
      </TouchableOpacity>
    </View>
  );

  /* ----- loading states ----- */
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  if (!classes.length)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#666" }}>Sin clases asignadas.</Text>
      </View>
    );

  /* ----- UI ----- */
  return (
    <View style={styles.wrapper}>
      {/* selector clase */}
      <Picker
        selectedValue={classId}
        onValueChange={setClassId}
        style={styles.picker}
      >
        {classes.map((c) => (
          <Picker.Item key={c.id} label={c.name} value={c.id} />
        ))}
      </Picker>

      {/* tabla */}
      <FlatList
        data={rows}
        keyExtractor={(r) => r.studentId}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#666" }}>
            Sin estudiantes.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* ---------- modal ajuste ---------- */}
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={() => setOpen(false)}
          />

          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Ajustar puntos – {selRow?.name}
            </Text>

            <TextInput
              placeholder="+10 / -5"
              keyboardType="numeric"
              value={delta}
              onChangeText={setDelta}
              style={styles.input}
            />
            <TextInput
              placeholder="Motivo (opcional)"
              value={reason}
              onChangeText={setReason}
              style={[styles.input, { height: 90 }]}
              multiline
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={async () => {
                const d = parseInt(delta, 10);
                if (!d || isNaN(d)) {
                  Alert.alert("Error", "Ingresa un número distinto de 0");
                  return;
                }
                try {
                  await adjustPoints({
                    studentId: selRow!.studentId,
                    delta: d,
                    reason: reason.trim() || undefined,
                  });
                  refreshRow(selRow!.studentId, selRow!.points + d);
                  setOpen(false);
                } catch {
                  Alert.alert("Error", "No se pudo guardar");
                }
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  wrapper: { flex: 1, backgroundColor: "#FAFAFA" },
  picker: { marginHorizontal: 16, marginVertical: 12 },

  /* fila */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  name: { flex: 1, fontSize: 16 },
  points: { width: 64, textAlign: "right", fontWeight: "700", color: "#4FC3F7" },
  editBtn: { padding: 6, marginLeft: 8 },

  /* modal */
  overlay: {
    flex: 1,
    backgroundColor: "#0008",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#4FC3F7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
