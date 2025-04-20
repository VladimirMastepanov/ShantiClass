import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Input, Text, XStack, YStack } from "tamagui";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalType, StudentsDescription } from "../../types/dbTypes";
import { ModalWindow } from "../../components/ModalWindow";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useStudentsContext } from "../../context/studentsContext";
import { LoadingElement } from "../../components/Loading";
import { useVisitContext } from "../../context/visitContext";
import { useDateContext } from "../../context/dateContext";
import { normolizeDate, normolizeDateType } from "../../utilities/dateToYYMMDD";
import { StudentsFlashList } from "../../components/StudentsFlashList";

export default function ShantiClass() {
  const [loading, setLoading] = useState(true);
  const db = useSQLiteContext();
  const { students, setShouldRefresh } = useStudentsContext();
  const { counter, studentsCurrentDayMarks, setShouldRefreshCounter } =
    useVisitContext();
  const { currentDate, setCurrentDate } = useDateContext();
  const [searchTerm, setSearchTerm] = useState("");
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const [selectedStudent, setSelectedStudent] =
    useState<StudentsDescription | null>(null);

  const [openCalendar, setOpenCalendar] = useState(false);

  const handleChangeData = (event: any, selectDate?: Date) => {
    // console.error("currentDate:", currentDate);
    // console.error("selectDate:", selectDate);
    if (event.type === "set" && selectDate) {
      setCurrentDate(normolizeDate(selectDate));
      setShouldRefresh(true);
      setShouldRefreshCounter(true);
    }
    setOpenCalendar(false);
    // console.error("newDate:", currentDate);
  };

  useEffect(() => {
    if (students && counter && studentsCurrentDayMarks) {
      // console.error('useEffect students:', students)
      // console.error('useEffect counter:', counter)
      // console.error('useEffect studentsCurrentDayMarks:', studentsCurrentDayMarks)
      setLoading(false);
    }
  }, [db, students, studentsCurrentDayMarks, counter]);

  const handleOpenModal = useCallback(() => {
    setModalType("new");
    setModalVisible(true);
  }, []);

  const handleOpenEditModal = useCallback((student: StudentsDescription) => {
    setModalType("old");
    setSelectedStudent(student);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedStudent(null);
    setModalVisible(false);
  }, []);

  if (loading) {
    return <LoadingElement />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <YStack
        flex={1}
        style={{
          alignItems: "center",
          paddingTop: insets.top + 10,
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        {/* Статистика */}
        <XStack
          width="100%"
          style={{
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Link
            style={{
              borderWidth: 1,
              borderColor: "#DFABCF",
              paddingHorizontal: 5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
            href="/statistic"
          >
            <XStack
              style={{
                paddingHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "800" }}>statistic</Text>
            </XStack>
          </Link>
          <Text>По абонименту: {counter?.subscribers || 0}</Text>
          <Text>Разовое: {counter?.unSubscribers || 0}</Text>
          <Text>Sarvasya: {counter?.visitors || 0}</Text>
        </XStack>

        {/* Поиск */}
        <XStack width="100%" style={{ marginBottom: 8 }}>
          <Input
            placeholder="om..."
            flex={1}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            autoCapitalize="none"
            autoCorrect={false}
            style={{borderColor: '#F1CCE1'}}
          />
          <Button
            onPress={handleOpenModal}
            style={{
              backgroundColor: "#DFABCF",
              paddingHorizontal: 12,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
            }}
          >
            <XStack style={{ alignItems: "center" }} gap={4}>
              <Text color="white">Новый</Text>
            </XStack>
          </Button>
        </XStack>

        {/* Заголовок таблицы */}
        <XStack
          width="100%"
          style={{
            justifyContent: "space-between",
            // backgroundColor: "gray3",
            borderRadius: 8,
            backgroundColor: "#F1CCE1",
            padding: 12,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#F1CCE1",
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontWeight: "bold",
                color: "#5D7AB5",
              }}
            >
              nāma
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#F1CCE1",
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#5D7AB5",
              }}
            >
              Оплачено занятий
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Button
              style={{ backgroundColor: "#F1CCE1", color: "#5D7AB5" }}
              onPress={() => setOpenCalendar(true)}
            >
              {currentDate}
            </Button>
            {openCalendar && (
              <DateTimePicker
                value={new Date(normolizeDateType(currentDate))}
                onChange={handleChangeData}
                mode="date"
                display="calendar"
              />
            )}
          </View>
        </XStack>

        {/* Список студентов */}
        <YStack flex={1} width="100%">
          <StudentsFlashList
            searchTerm={searchTerm}
            handleOpenEditModal={handleOpenEditModal}
          />
        </YStack>
        {/* Модальные окна */}
        <ModalWindow
          modalType={modalType}
          modalVisible={modalVisible}
          closeModal={handleCloseModal}
          editedStudent={selectedStudent}
        />
      </YStack>
    </SafeAreaView>
  );
}
