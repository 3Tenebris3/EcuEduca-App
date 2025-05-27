/* pantalla de ajustes: muestra datos básicos + cambiar avatar +
   cambiar contraseña + cerrar sesión  */

import PrimaryButton from "@/components/ui/PrimaryButton";
import { avatarKeys, avatars } from "@/constants/avatar";
import { logout as doLogout } from "@/services/auth.service";
import {
    changePassword,
    updateAvatar,
} from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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

export default function SettingsScreen() {
  const { user, setUser } = useAuthStore();

  /* -------------- avatar picker ----------------- */
  const [openAv, setOpenAv] = useState(false);
  const [selected, setSelected] = useState(user?.avatar ?? avatarKeys[0]);
  const [savingAv, setSavingAv] = useState(false);

  const saveAvatar = async () => {
    try {
      setSavingAv(true);
      const updated = await updateAvatar(selected);
      setUser(updated);
      setOpenAv(false);
    } catch {
      Alert.alert("Error", "No se pudo actualizar el avatar");
    } finally {
      setSavingAv(false);
    }
  };

  /* -------------- password modal ---------------- */
  const [openPwd, setOpenPwd]   = useState(false);
  const [oldPwd, setOldPwd]     = useState("");
  const [newPwd, setNewPwd]     = useState("");
  const [repPwd, setRepPwd]     = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const handlePwd = async () => {
    if (newPwd !== repPwd) return Alert.alert("Error", "Las contraseñas no coinciden");
    try {
      setSavingPwd(true);
      await changePassword(oldPwd, newPwd);
      Alert.alert("Éxito", "Contraseña actualizada");
      setOpenPwd(false);
      setOldPwd(""); setNewPwd(""); setRepPwd("");
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message ?? "Fallo al cambiar");
    } finally {
      setSavingPwd(false);
    }
  };

  /* -------------- logout ------------------------ */
  const handleLogout = async () => {
    await doLogout();
    setUser(null);
  };

  /* -------------- helpers ----------------------- */
  const avatarSrc =
    avatars[avatarKeys.findIndex(k => k === (user?.avatar ?? avatarKeys[0]))];

  return (
    <ScrollView style={styles.container}>
      {/* avatar */}
      <View style={styles.avatarWrap}>
        <Image source={avatarSrc} style={styles.avatar} />
        <TouchableOpacity style={styles.editBtn} onPress={() => setOpenAv(true)}>
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* datos básicos */}
      <InfoCard>
        <Row label="Nombre"  value={user?.displayName} />
        <Row label="Correo"  value={user?.email} />
        <Row label="Rol"     value={user?.role} />
        <Row label="Teléfono" value={user?.phone ?? "—"} />
      </InfoCard>

      {/* acciones */}
      <PrimaryButton
        title="Cambiar contraseña"
        onPress={() => setOpenPwd(true)}
        small
      />
      <PrimaryButton title="Cerrar sesión" onPress={handleLogout} small />

      {/* ------------ modal avatar ------------ */}
      <Modal visible={openAv} transparent animationType="fade">
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setOpenAv(false)}
          />
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.close} onPress={() => setOpenAv(false)}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Elige tu avatar</Text>
            <FlatList
              data={avatars}
              numColumns={4}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={{ paddingBottom: 8 }}
              renderItem={({ item, index }) => {
                const key   = avatarKeys[index];
                const sel   = key === selected;
                return (
                  <TouchableOpacity
                    onPress={() => setSelected(key)}
                    style={[
                      styles.avatarPick,
                      sel && { borderColor: colors.primary, borderWidth: 2 },
                    ]}
                  >
                    <Image source={item} style={styles.avatarPickImg} />
                  </TouchableOpacity>
                );
              }}
            />
            {savingAv
              ? <ActivityIndicator />
              : <PrimaryButton title="Guardar" onPress={saveAvatar} small />
            }
          </View>
        </View>
      </Modal>

      {/* ------------ modal contraseña ---------- */}
      <Modal visible={openPwd} transparent animationType="fade">
        <View style={styles.overlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1}
                            onPress={() => setOpenPwd(false)} />
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.close} onPress={() => setOpenPwd(false)}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Cambiar contraseña</Text>
            <TextInput
              placeholder="Actual"
              secureTextEntry
              style={styles.input}
              value={oldPwd}
              onChangeText={setOldPwd}
            />
            <TextInput
              placeholder="Nueva"
              secureTextEntry
              style={styles.input}
              value={newPwd}
              onChangeText={setNewPwd}
            />
            <TextInput
              placeholder="Repetir nueva"
              secureTextEntry
              style={styles.input}
              value={repPwd}
              onChangeText={setRepPwd}
            />
            {savingPwd
              ? <ActivityIndicator />
              : <PrimaryButton title="Guardar" onPress={handlePwd} small />
            }
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ---------- UI helpers ---------- */
const InfoCard = ({ children }: any) => (
  <View style={styles.card}>{children}</View>
);
const Row = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowVal}>{value}</Text>
  </View>
);

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#F6F8FB" },
  avatarWrap:{ alignItems:"center", marginTop:24 },
  avatar:{ width:140, height:140, borderRadius:70 },
  editBtn:{
    position:"absolute", bottom:0, right:"40%",
    backgroundColor:colors.primary, borderRadius:14, padding:6,
  },

  card:{
    marginHorizontal:22, marginTop:18, padding:16,
    backgroundColor:"#fff", borderRadius:10, borderWidth:1, borderColor:"#DDD",
  },
  row:{ flexDirection:"row", justifyContent:"space-between", marginVertical:6 },
  rowLabel:{ fontWeight:"600", color:"#555" },
  rowVal:{ maxWidth:"60%", textAlign:"right" },

  /* modal gen */
  overlay:{
    flex:1, backgroundColor:"#0008", justifyContent:"center", alignItems:"center",
    padding:24,
  },
  modalCard:{
    width:"100%", maxWidth:380, backgroundColor:"#fff",
    borderRadius:12, padding:16,
  },
  close:{ position:"absolute", top:6, right:6, padding:4 },
  modalTitle:{ fontSize:18, fontWeight:"700", marginBottom:12 },

  avatarPick:{ flex:1, margin:6, alignItems:"center", borderRadius:40 },
  avatarPickImg:{ width:70, height:70, borderRadius:35 },

  input:{
    borderWidth:1, borderColor:"#CCC", borderRadius:8,
    padding:10, marginVertical:6,
  },
});
