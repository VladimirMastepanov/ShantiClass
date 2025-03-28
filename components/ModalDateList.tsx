import { FlatList, Modal, View } from "react-native";
import { Text,  Button } from "tamagui";



interface ModalDateListProps {
  modalVisible: boolean;
  studentsList?: string[];
  closeModalList: () => void;
}

export const ModalDateList = (props: ModalDateListProps) => {
  const {modalVisible, studentsList, closeModalList} = props;

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
            data={studentsList}
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
}