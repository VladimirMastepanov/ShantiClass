import { Modal, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Input, XStack, Text, YStack, Checkbox, Button } from "tamagui";
import { StudentsDescription } from "../types/dbTypes";
import { useState } from "react";

interface ModalEdithProps {
  modalVisible: boolean;
  editedStudent?: StudentsDescription | null;
  closeModal: () => void;
}

export const ModalWindow = (props: ModalEdithProps) => {
  const { modalVisible, editedStudent, closeModal } = props;

  const [name, setName] = useState(editedStudent?.name || "");
  const [instagram, setInstagram] = useState(editedStudent?.instagram || "");
  const [paidLessons, setPaidLessons] = useState(
    editedStudent?.paidLessons || 0
  );
  const [startSubscription, setStartSubscription] = useState(
    editedStudent?.startSubscription || ""
  );
  const [additional, setAdditional] = useState(editedStudent?.additional || "");

  const handleCloseModal = () => {
    //сохраняю изменения в базу
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
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
            width: "90%",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <XStack
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text fontSize={18} fontWeight="bold">
              Информация о студенте
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Text fontSize={24}>×</Text>
            </TouchableOpacity>
          </XStack>

          <YStack space={12}>
            <YStack>
              <Text>Name:</Text>
              <Input value={name} onChangeText={(text) => setName(text)} />
            </YStack>
            <YStack>
              <Text>Instagram:</Text>
              <Input
                value={instagram || ""}
                onChangeText={(text) => setInstagram(text)}
              />
            </YStack>

            <YStack>
              <Text>Оплаченные занятия:</Text>
              <Input
                value={paidLessons?.toString() || "0"}
                onChangeText={(text) => setPaidLessons(parseInt(text))}
                keyboardType="numeric"
              />
            </YStack>

            <XStack style={{ alignItems: "center" }} space={8}>
              <Text>Абонемент c: {startSubscription}</Text>
            </XStack>

            <YStack>
              <Text>Дополнительная Информация:</Text>
              <Input
                value={additional || ""}
                onChangeText={(text) => setAdditional(text)}
                keyboardType="numeric"
              />
            </YStack>

            <XStack
              style={{ justifyContent: "flex-end", marginTop: 20 }}
              space={12}
            >
              <Button
                style={{ backgroundColor: "#e74c3c", color: "white" }}
                onPress={closeModal}
              >
                Отмена
              </Button>
              <Button
                style={{ backgroundColor: "#2ecc71", color: "white" }}
                onPress={handleCloseModal}
              >
                Сохранить
              </Button>
            </XStack>
          </YStack>
        </View>
      </View>
    </Modal>
  );
};
