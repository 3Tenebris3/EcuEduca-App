import CourseCard from "@/components/ui/CourseCard";
import { CourseDto, getMyCourses } from "@/services/course.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function Courses() {
  const [list, setList] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMyCourses().then((r) => { setList(r); setLoading(false); });
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <CourseCard
            name={item.name}
            icon={require("../../assets/images/book.png")}
            onPress={() =>
              router.push({
                pathname: "../course/[cid]/units",
                params: { cid: item.id },
              })
            }
          />
        )}
      />
    </View>
  );
}
