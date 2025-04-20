import { FlashList } from "@shopify/flash-list";
import { Checkbox, Text, XStack } from "tamagui";
import { Pressable, View } from "react-native";
import { useMemo, useRef } from "react";
import { StudentsDescription } from "../types/dbTypes";
import { useStudentsContext } from "../context/studentsContext";
import { unmarkVisit } from "../database/api/unmarcVisit";
import { markVisit } from "../database/api/markVisit";
import { useDateContext } from "../context/dateContext";
import { useVisitContext } from "../context/visitContext";
import { useSQLiteContext } from "expo-sqlite";

interface StudentsFlashListProps {
  searchTerm: string;
  handleOpenEditModal: (student: StudentsDescription) => void;
}

export const StudentsFlashList = (props: StudentsFlashListProps) => {
  const { searchTerm, handleOpenEditModal } = props;
  const listRef = useRef<FlashList<StudentsDescription> | null>(null);
  const { students, setShouldRefresh } = useStudentsContext();
  const { currentDate } = useDateContext();
  const { studentsCurrentDayMarks, setShouldRefreshCounter } = useVisitContext();
  const db = useSQLiteContext();

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    if (!searchTerm.trim()) return students;

    const searchTermLower = searchTerm.toLowerCase();
    return students.filter(
      (student: StudentsDescription) =>
        student.name.toLowerCase().includes(searchTermLower) ||
        student.instagram?.toLowerCase().includes(searchTermLower)
    );
  }, [students, searchTerm]);

  const handleToggleCheck = async (student: StudentsDescription) => {
    const id = student.id.toString();
    const isCurrentlyChecked = studentsCurrentDayMarks[id] || false;
    // console.error('StudentsFlashList handleToggleCheck studentsCurrentDayMarks:', studentsCurrentDayMarks)
    try {
      if (isCurrentlyChecked) {
        await unmarkVisit(student.id, currentDate, db);
      } else {
        await markVisit(student.id, currentDate, student.hasSubscription, db);
      }
      await setShouldRefresh(true);
      await setShouldRefreshCounter(true);
    } catch (err) {
      console.error("Ошибка отметки посещения (StudentsFlashList handleToggleCheck):", err);
    }
  };

  return (
    <FlashList
      ref={listRef}
      data={filteredStudents}
      estimatedItemSize={50}
      renderItem={({ item }) => (
        <XStack
          width="100%"
          style={{
            borderBottomColor: "#8FD2E6",
            borderBottomWidth: 1,
            padding: 12,
            minHeight: 32,
            alignItems: "center",
            ...(item.hasSubscription ? {} : { backgroundColor: "#E8E9E9" }),
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              handleOpenEditModal(item);
            }}
          >
            <View
              style={{
                width: "100%",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ textAlign: "left" }}>{item.name}</Text>
            </View>
          </Pressable>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text flex={1} style={{ textAlign: "center" }}>
              {item.paidLessons ?? 0}
            </Text>
          </View>

          <XStack
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Checkbox
              style={{
                height: 20,
                width: 20,
                borderColor: studentsCurrentDayMarks[item.id]
                  ? "#8FD2E6"
                  : "#DFABCF",
                backgroundColor: studentsCurrentDayMarks[item.id]
                  ? "#5D7AB5"
                  : "white",
                borderWidth: 1,
                borderRadius: 3,
              }}
              onCheckedChange={() => handleToggleCheck(item)}
            >
              <Checkbox.Indicator>
                <View
                  style={{
                    width: 14,
                    height: 14,
                  }}
                />
              </Checkbox.Indicator>
            </Checkbox>
          </XStack>
        </XStack>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};
