/* app/teacher/reports/index.tsx */
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

import { ClassProgress, getClassProgress } from "@/services/progress.service";
import { getClasses } from "../../src/services/class.service";

const screenW = Dimensions.get("window").width;

/* ─────────────────────────────────────────────────────────── */
export default function ReportsScreen() {
  /* ---------- state ---------- */
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [progress, setProgress] = useState<ClassProgress[] | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- initial fetch ---------- */
  useEffect(() => {
    (async () => {
      try {
        const cls = await getClasses(); // GET /teacher/classes
        setClasses(cls);
        if (cls.length) setSelected(cls[0].id);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- load progress when class changes ---------- */
  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    (async () => {
      try {
        const data = await getClassProgress(selected); // GET /teacher/progress?classId=
        setProgress(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [selected]);

  /* ---------- loading / empty ---------- */
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  if (!classes.length)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#666" }}>Aún no tienes clases asignadas.</Text>
      </View>
    );

  if (!progress?.length)
    return (
      <View style={styles.center}>
        <Picker
          selectedValue={selected}
          onValueChange={(v) => setSelected(v)}
          style={styles.picker}
        >
          {classes.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
        <Text style={{ color: "#666" }}>Sin datos para esta clase.</Text>
      </View>
    );

  /* ---------- transform data ---------- */
  const names = progress.map((p) => p.student);
  const pointsArr = progress.map((p) => p.points);
  const scenPct = progress.map(
    (p) => Math.round((p.scenarios / Math.max(p.scenarios, 1)) * 100) // placeholder %
  );

  /* ---------- UI ---------- */
  return (
    <ScrollView
      style={styles.wrapper}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* selector */}
      <Picker
        selectedValue={selected}
        onValueChange={(v) => setSelected(v)}
        style={styles.picker}
      >
        {classes.map((c) => (
          <Picker.Item key={c.id} label={c.name} value={c.id} />
        ))}
      </Picker>

      {/* puntos */}
      <Text style={styles.chartTitle}>Puntos 🔢</Text>
      <BarChart
        data={{
          labels: names,
          datasets: [{ data: pointsArr }],
        }}
        width={screenW - 32}
        height={220}
        chartConfig={chartCfg}
        fromZero
        showValuesOnTopOfBars
        yAxisLabel={""}
        yAxisSuffix={""}
      />

      {/* % escenarios */}
      <Text style={[styles.chartTitle, { marginTop: 32 }]}>
        % Escenarios completados 🏺
      </Text>
      <LineChart
        data={{
          labels: names,
          datasets: [{ data: scenPct }],
        }}
        width={screenW - 32}
        height={240}
        chartConfig={chartCfg}
        bezier
        fromZero
      />
    </ScrollView>
  );
}

/* ---------- chart look ---------- */
const chartCfg = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  fillShadowGradient: "#4FC3F7",
  fillShadowGradientOpacity: 0.9,
  color: () => "#4FC3F7",
  labelColor: () => "#37474F",
  strokeWidth: 2,
  decimalPlaces: 0,
};

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  wrapper: { flex: 1, backgroundColor: "#FAFAFA", paddingHorizontal: 16 },
  picker: { marginBottom: 20 },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#37474F",
    marginBottom: 8,
  },
});
