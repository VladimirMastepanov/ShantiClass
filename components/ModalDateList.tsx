import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { FlatList, Modal, View } from "react-native";
import { Text, Button } from "tamagui";
import { getStudentVisitDates } from "../database/api/getStudentVisitDates";

interface ModalDateListProps {
  modalVisible: boolean;
  studentId: number | null;
  closeModalList: () => void;
}

export const ModalDateList = (props: ModalDateListProps) => {
  const { modalVisible, studentId, closeModalList } = props;

  const db = useSQLiteContext();
  const [dateList, setDateList] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async (id: number, db: SQLiteDatabase) => {
      try {
        const visitDates = await getStudentVisitDates(id, db);
        setDateList(visitDates);
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

          <FlatList
            data={dateList}
            renderItem={({ item }) => (
              <Text style={{ padding: 10, fontSize: 16 }}>{item}</Text>
            )}
            keyExtractor={(item) => item}
          />

          <Button
            style={{
              backgroundColor: "#e74c3c",
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
