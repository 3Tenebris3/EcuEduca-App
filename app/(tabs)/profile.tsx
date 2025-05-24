import { avatarKeys, avatars } from "@/constants/avatar";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import { logout } from "../../src/services/auth.service";
import {
  changePassword,
  getMyStudents,
  getTeacherInfo,
  updateAvatar,
} from "../../src/services/user.service";
import { useAuthStore } from "../../src/store/useAuthStore";
import { colors } from "../../src/theme/colors";
import { roleToSpanish } from "../../src/utils/role.util";

export default function ProfileScreen() {
  const { user, setUser } = useAuthStore();

  /* ----- extra info -------- */
  const [teacher, setTeacher] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);

  /* ----- avatar modal state -------- */
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(user?.avatar ?? avatarKeys[0]);
  const [saving, setSaving] = useState(false);

  /* ----- fetch teacher/students on mount -------- */
  useEffect(() => {
    if (user?.role === "student") {
      getTeacherInfo().then(setTeacher);
    }
    if (user?.role === "teacher") {
      getMyStudents().then(setStudents);
    }
  }, [user?.role]);

  /* ----- handlers -------- */
  const saveAvatar = async () => {
    try {
      setSaving(true);
      const updated = await updateAvatar(selected);
      setUser(updated);
      setOpen(false);
    } catch {
      Alert.alert("Error", "No se pudo actualizar el avatar");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  /* ----- helpers -------- */
  const avatarSrc =
    avatars[avatarKeys.findIndex((k) => k === (user?.avatar ?? avatarKeys[0]))];
  const [pwdOpen, setPwdOpen] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [samePwd, setSamePwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Avatar + edit icon */}
      <View style={styles.avatarWrapper}>
        <Image source={avatarSrc} style={styles.avatar} />
        <TouchableOpacity style={styles.editBtn} onPress={() => setOpen(true)}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main info */}
      <InfoCard>
        <InfoRow label="Nombre" value={user?.displayName} />
        <InfoRow label="Correo" value={user?.email} />
        <InfoRow label="Teléfono" value={user?.phone ?? "—"} />
        <InfoRow
          label="Rol"
          value={roleToSpanish(user?.role ?? user?.role ?? "")}
        />
      </InfoCard>

      {/* Extra blocks */}
      {user?.role === "student" && teacher && (
        <InfoCard title="Profesor asignado">
          <InfoRow label="Nombre" value={teacher.displayName} />
          <InfoRow label="Correo" value={teacher.email} />
          <InfoRow label="Teléfono" value={teacher.phone ?? "—"} />
        </InfoCard>
      )}

      {user?.role === "teacher" && (
        <InfoCard title={`Estudiantes (${students.length})`}>
          {students.map((s) => (
            <InfoRow key={s.id} label={s.displayName} value={s.email} small />
          ))}
        </InfoCard>
      )}

      {/* Support */}
      <InfoCard title="Soporte">
        <Text>Correo: soporte@ecueduca.com</Text>
        <Text>Teléfono: +593 99-999-9999</Text>
      </InfoCard>

      <PrimaryButton
        title="Cambiar contraseña"
        onPress={() => setPwdOpen(true)}
        small
      />
      <PrimaryButton title="Cerrar sesión" onPress={handleLogout} small />

      {/* -------- Modal Avatar -------- */}
      {/* -------- Modal Avatar -------- */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        {/* full-screen overlay */}
        <View style={styles.overlay}>
          {/* tap anywhere outside the card -> close */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          />
          {/* floating card */}
          <View style={styles.cardModal}>
            {/* close icon */}
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={24} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Elige tu avatar</Text>

            {/* list – 4 columns – own scroll */}
            <FlatList
              data={avatars}
              keyExtractor={(_, i) => i.toString()}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
              style={{ maxHeight: 340 }}
              renderItem={({ item, index }) => {
                const name = avatarKeys[index];
                const isSel = name === selected;
                return (
                  <TouchableOpacity
                    onPress={() => setSelected(name)}
                    style={[
                      styles.avatarWrap,
                      isSel && { borderColor: colors.primary, borderWidth: 2 },
                    ]}
                  >
                    <Image source={item} style={styles.avatarImg} />
                  </TouchableOpacity>
                );
              }}
            />

            {saving ? (
              <ActivityIndicator style={{ marginTop: 4 }} />
            ) : (
              <PrimaryButton title="Guardar" onPress={saveAvatar} small />
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={pwdOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setPwdOpen(false)}
          />
          <View style={styles.cardModal}>
            <TouchableOpacity
              onPress={() => setPwdOpen(false)}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={24} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Cambiar contraseña</Text>
            <TextInput
              placeholder="Contraseña actual"
              secureTextEntry
              style={styles.input}
              value={oldPwd}
              onChangeText={setOldPwd}
            />
            <TextInput
              placeholder="Nueva contraseña"
              secureTextEntry
              style={styles.input}
              value={newPwd}
              onChangeText={setNewPwd}
            />
            <TextInput
              placeholder="Repite la contraseña"
              secureTextEntry
              style={styles.input}
              value={samePwd}
              onChangeText={setSamePwd}
            />

            {pwdSaving ? (
              <ActivityIndicator style={{ marginTop: 4 }} />
            ) : (
              <PrimaryButton
                title="Guardar"
                onPress={async () => {
                  try {
                    setPwdSaving(true);
                    await changePassword(oldPwd, newPwd);
                    if (newPwd !== samePwd) {
                      return Alert.alert("Érror", "Las contraseñas no coinciden");
                    }

                    Alert.alert("Éxito", "Contraseña actualizada");
                    setPwdOpen(false);
                    setOldPwd("");
                    setNewPwd("");
                  } catch (e: any) {
                    Alert.alert(
                      "Error",
                      e?.response?.data?.message ?? "No se pudo cambiar"
                    );
                  } finally {
                    setPwdSaving(false);
                  }
                }}
                small
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ---------- Small reusable pieces ---------- */
const InfoCard = ({ children, title }: any) => (
  <View style={styles.card}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    {children}
  </View>
);

const InfoRow = ({
  label,
  value,
  small = false,
}: {
  label: string;
  value?: string;
  small?: boolean;
}) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, small && { fontSize: 14 }]}>{label}</Text>
    <Text style={[styles.rowValue, small && { fontSize: 14 }]}>{value}</Text>
  </View>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  avatarWrapper: { alignItems: "center", marginTop: 24 },
  avatar: { width: 140, height: 140, borderRadius: 70 },
  editBtn: {
    position: "absolute",
    bottom: 0,
    right: "40%",
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 6,
  },
  card: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  cardTitle: { fontWeight: "700", marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  rowLabel: { fontWeight: "600", color: colors.textLight },
  rowValue: { maxWidth: "60%", textAlign: "right" },

  /* modal */
  modalBg: { flex: 1, backgroundColor: "#0008", justifyContent: "center" },
  modalCard: {
    marginHorizontal: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalAvatarWrap: {
    flex: 1,
    alignItems: "center",
    margin: 6,
    borderRadius: 40,
  },
  modalAvatar: { width: 80, height: 80, borderRadius: 40 },
  modalClose: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#0008",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  cardModal: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
  },
  avatarWrap: {
    flex: 1,
    margin: 6,
    alignItems: "center",
    borderRadius: 40,
  },
  avatarImg: { width: 70, height: 70, borderRadius: 35 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },  
});
