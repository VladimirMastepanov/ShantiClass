import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { FlatList, Modal, View } from "react-native";
import { Text, Button } from "tamagui";
import { getStudentVisitDates } from "../database/api/getStudentVisitDates";
import { groupDatesByMonth } from "../utilities/groupDatesByMonth";

interface ModalDateListProps {
  modalVisible: boolean;
  studentId: number | null;
  closeModalList: () => void;
}

export const ModalDateList = (props: ModalDateListProps) => {
  const { modalVisible, studentId, closeModalList } = props;

  const db = useSQLiteContext();
  const [groupedDates, setGroupedDates] = useState<Record<string, string[]>>(
    {}
  );
  useEffect(() => {
    const loadData = async (id: number, db: SQLiteDatabase) => {
      try {
        const visitDates = await getStudentVisitDates(id, db);
        const grouped = groupDatesByMonth(visitDates);
        setGroupedDates(grouped);
      } catch (err) {
        console.error("Ошибка загрузки дат посещения: ", err);
      }
    };

    if (studentId) loadData(studentId, db);
  }, [db, studentId]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModalList}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Список дат:</Text>

          <ScrollView>
            {Object.entries(groupedDates).map(([month, days]) => (
              <View key={month} style={{ marginBottom: 15 }}>
                <Text
                  style={{ color: '#5D7AB5',fontWeight: "bold", fontSize: 16, marginBottom: 5 }}
                >
                  {month + ":"}
                </Text>
                <Text style={{ fontSize: 15 }}>
                  {days.join(",  ")}
                </Text>
              </View>
            ))}
          </ScrollView>

          <Button
            style={{
              backgroundColor: "#DFABCF",
              color: "white",
              marginTop: 20,
              alignSelf: "center",
            }}
            onPress={closeModalList}
          >
            Закрыть
          </Button>
        </View>
      </View>
    </Modal>
  );
};
