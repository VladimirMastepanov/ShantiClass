import { Modal, Pressable, View } from "react-native";
import { Input, XStack, Text, YStack, Checkbox, Button } from "tamagui";
import { ModalType, StudentsDescription } from "../types/dbTypes";
import { useCallback, useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ModalDateList } from "./ModalDateList";
import { insertStudent } from "../database/api/insertStudent";
import { useSQLiteContext } from "expo-sqlite";
import { updateStudent } from "../database/api/updateStudent";
import { useStudentsContext } from "../context/studentsContext";
import { normolizeDate } from "../utilities/dateToYYMMDD";

interface ModalEdithProps {
  modalType: ModalType;
  modalVisible: boolean;
  editedStudent?: StudentsDescription | null;
  closeModal: () => void;
}

export const ModalWindow = (props: ModalEdithProps) => {
  const { modalType, modalVisible, editedStudent, closeModal } = props;

  const db = useSQLiteContext();
  const { setShouldRefresh } = useStudentsContext();
  const [id, setId] = useState(editedStudent?.id || null);
  const [name, setName] = useState(editedStudent?.name || "");
  const [instagram, setInstagram] = useState(editedStudent?.instagram || "@");
  const [paidLessons, setPaidLessons] = useState(
    editedStudent?.paidLessons || 0
  );
  const [inputPaidLessons, setInputPaidLessons] = useState(
    (editedStudent?.paidLessons || 0).toString()
  );
  const [startSubscription, setStartSubscription] = useState(
    editedStudent?.startSubscription || ""
  );
  const [additional, setAdditional] = useState(editedStudent?.additional || "");
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openModalDateList, setOpenModalDateList] = useState(false);

  const resetForm = useCallback((student?: StudentsDescription | null) => {
    setId(student?.id || null);
    setName(student?.name || "");
    setInstagram(student?.instagram || "@");
    setPaidLessons(student?.paidLessons || 0);
    setInputPaidLessons((student?.paidLessons ?? 0).toString());
    setStartSubscription(student?.startSubscription || "");
    setAdditional(student?.additional || "");
  }, []);

  const handleCloseDateListModal = () => setOpenModalDateList(false);

  const handleChangeData = (event: any, selectDate?: Date) => {
    if (event.type === "set" && selectDate) {
      setStartSubscription(normolizeDate(selectDate));
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
          paidLessons,
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
    if (modalType === "old" && editedStudent && id) {
      try {
        const updatingStudent = {
          id,
          name,
          instagram,
          hasSubscription: editedStudent.hasSubscription,
          startSubscription,
          additional,
          paidLessons,
        };
        await updateStudent(db, updatingStudent);
        setShouldRefresh(true);
      } catch (err) {
        console.error("error updaiting student:", err);
      }
    }
    resetForm(null);
    closeModal();
  };

  const handleCloseModal = () => {
    resetForm(null);
    closeModal();
  };

  useEffect(() => {
    if (modalVisible) {
      if (modalType === "new") {
        resetForm(null);
      } else {
        resetForm(editedStudent);
      }
    }
  }, [modalVisible, editedStudent, modalType, resetForm]);

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
                    value={inputPaidLessons}
                    onChangeText={(text) => {
                      setInputPaidLessons(text);
                      if (text === "") {
                        setPaidLessons(0);
                      } else if (/^\d+$/.test(text)) {
                        setPaidLessons(parseInt(text, 10));
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 1.3 }}>
                  <Button style={{color: "white", backgroundColor: "#8FD2E6"}}  onPress={() => setOpenModalDateList(true)}>
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
                <Button style={{color: "white", backgroundColor: "#8FD2E6"}} onPress={() => setOpenCalendar(true)}>Change</Button>

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
                style={{ backgroundColor: "#DFABCF", color: "white" }}
                onPress={handleCloseModal}
              >
                Close
              </Button>
              <Button
                style={{ backgroundColor: "#5D7AB5", color: "white" }}
                onPress={handleSveChanges}
              >
                Save
              </Button>
            </XStack>
            <ModalDateList
              modalVisible={openModalDateList}
              studentId={id}
              closeModalList={handleCloseDateListModal}
            />
          </YStack>
        </View>
      </View>
    </Modal>
  );
};
