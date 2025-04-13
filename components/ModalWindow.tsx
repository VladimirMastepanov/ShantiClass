import { Modal, Pressable, View } from "react-native";
import { Input, XStack, Text, YStack, Checkbox, Button } from "tamagui";
import { ModalType, StudentsDescription } from "../types/dbTypes";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ModalDateList } from "./ModalDateList";
import { insertStudent } from "../database/api/insertStudent";
import { useSQLiteContext } from "expo-sqlite";
import { updateStudent } from "../database/api/updateStudent";
import { useStudents } from "../context/studentsContext";

interface ModalEdithProps {
  modalType: ModalType;
  modalVisible: boolean;
  editedStudent?: StudentsDescription | null;
  closeModal: () => void;
}

export const ModalWindow = (props: ModalEdithProps) => {
  const { modalType, modalVisible, editedStudent, closeModal } = props;

  const db = useSQLiteContext();
  const { setShouldRefresh } = useStudents();
  const [name, setName] = useState(editedStudent?.name || "");
  const [instagram, setInstagram] = useState(editedStudent?.instagram || "@");
  const [paidLessons, setPaidLessons] = useState(
    editedStudent?.paidLessons || 0
  );
  const [inputPaidLessins, setInputPaidLessons] = useState("0");
  const [startSubscription, setStartSubscription] = useState(
    editedStudent?.startSubscription || ""
  );
  const [visitHistory] = useState(editedStudent?.history || []);
  const [additional, setAdditional] = useState(editedStudent?.additional || "");

  const [openCalendar, setOpenCalendar] = useState(false);

  const [openModalDateList, setOpenModalDateList] = useState(false);

  const handleCloseDateListModal = () => setOpenModalDateList(false);

  const handleChangeData = (event: any, selectDate?: Date) => {
    if (event.type === "set" && selectDate) {
      setStartSubscription(selectDate.toLocaleDateString());
    }
    setOpenCalendar(false);
  };

  const handleSveChanges = async () => {
    //сохраняю изменения в базу

    if (modalType === "new") {
      try {
        const newStudentData = {
          name,
          instagram,
          paidLessons: paidLessons,
          startSubscription,
          additional,
          hasSubscription: startSubscription === "" ? 0 : 1,
        };
        await insertStudent(db, newStudentData);
        setShouldRefresh(true);
      } catch (err) {
        console.error("Error inserting new student:", err);
      }
    }
    if (modalType === "old" && editedStudent) {
      try {
        const updatingStudent = {
          id: editedStudent?.id,
          name,
          instagram,
          hasSubscription: editedStudent.hasSubscription,
          startSubscription,
          additional,
          paidLessons,
          history: editedStudent.history,
        };
        await updateStudent(db, updatingStudent);
        setShouldRefresh(true);
      } catch (err) {
        console.error("error updaiting student:", err);
      }
    }

    //clean state
    setName("");
    setInstagram("");
    setPaidLessons(0);
    setStartSubscription("");
    setAdditional("");
    closeModal();
    setInputPaidLessons('0')
  };

  const handleCloseModal = () => {
    //clean state
    setName("");
    setInstagram("");
    setPaidLessons(0);
    setStartSubscription("");
    setAdditional("");
    setInputPaidLessons('0')

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
            <Pressable onPress={closeModal}>
              <Text fontSize={24}>×</Text>
            </Pressable>
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
              <XStack>
                <View style={{ flex: 1.5 }}>
                  <Input
                    value={inputPaidLessins}
                    onChangeText={(text) => {
                      console.error(text);
                      setInputPaidLessons(text); 

                      if (/^\d*$/.test(text)) {
                        setPaidLessons(parseInt(text, 10));

                      } else if(text === '') {
                        setPaidLessons(0);
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 1.3 }}>
                  <Button onPress={() => setOpenModalDateList(true)}>
                    History
                  </Button>
                </View>
              </XStack>
            </YStack>

            <XStack style={{ alignItems: "center" }}>
              <View style={{ flex: 2 }}>
                <Text>Абонемент c: {startSubscription}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Button onPress={() => setOpenCalendar(true)}>change</Button>

                {openCalendar && (
                  <DateTimePicker
                    value={new Date()}
                    onChange={handleChangeData}
                    mode="date"
                    display="calendar"
                  />
                )}
              </View>
            </XStack>

            <YStack>
              <Text>Дополнительная Информация:</Text>
              <Input
                value={additional || ""}
                onChangeText={(text) => setAdditional(text)}
                multiline={true}
                numberOfLines={6}
                verticalAlign="top"
              />
            </YStack>

            <XStack
              style={{ justifyContent: "flex-end", marginTop: 20 }}
              space={12}
            >
              <Button
                style={{ backgroundColor: "#e74c3c", color: "white" }}
                onPress={handleCloseModal}
              >
                Close
              </Button>
              <Button
                style={{ backgroundColor: "#2ecc71", color: "white" }}
                onPress={handleSveChanges}
              >
                Save
              </Button>
            </XStack>
            <ModalDateList
              modalVisible={openModalDateList}
              studentsList={visitHistory}
              closeModalList={handleCloseDateListModal}
            />
          </YStack>
        </View>
      </View>
    </Modal>
  );
};
