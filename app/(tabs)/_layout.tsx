import React, { useEffect, useMemo, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Checkbox, Input, Text, XStack, YStack } from "tamagui";
import { Link } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import STUDENTS from "../../STUDENTS.json";
import { StudentsDescription } from "../../types/dbTypes";

interface CountersDescription {
  visitors: number;
  subscribers: number;
  unSubscribers: number;
}

export default function ShantiClass() {
  const [loading, setLoading] = useState(true);
  const db = useSQLiteContext();
  const [students, setStudents] = useState<StudentsDescription[]>([]);

  const [visited, setVisited] = useState<Record<string, boolean>>({});

  const listRef = useRef<FlashList<StudentsDescription> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const insets = useSafeAreaInsets();

  const [counters, setCounters] = useState<CountersDescription>({
    visitors: 0,
    subscribers: 0,
    unSubscribers: 0,
  });

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students;
    }
    const searchTermLower = searchTerm.toLowerCase();
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTermLower)
    );
  }, [students, searchTerm]);

  useEffect(() => {
    const initialVisited: Record<string, boolean> = {};
    STUDENTS.forEach((s) => (initialVisited[s.id.toString()] = false));
    setStudents(STUDENTS);
    setVisited(initialVisited);
    setLoading(false);
  }, []);

  const handleToggleCheck = (studentId: number) => {
    const id = studentId.toString();

    setVisited((prev) => {
      const isCurrentlyChecked = prev[id] || false; // текущее состояние

      const targetStudent = students.find((s) => s.id === studentId);
      if (!targetStudent) return prev;

      // Обновляем счетчики внутри колбэка setVisited
      setCounters((prevCounters) => {
        return {
          visitors: prevCounters.visitors + (isCurrentlyChecked ? -1 : 1),
          subscribers:
            prevCounters.subscribers +
            (targetStudent.hasSubscription ? (isCurrentlyChecked ? -1 : 1) : 0),
          unSubscribers:
            prevCounters.unSubscribers +
            (!targetStudent.hasSubscription
              ? isCurrentlyChecked
                ? -1
                : 1
              : 0),
        };
      });

      return {
        ...prev,
        [id]: !isCurrentlyChecked, // Переключаем состояние
      };
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text>Загрузка...</Text>
      </SafeAreaView>
    );
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
          <Link href="/statistic">
            <XStack style={{ paddingRight: 30 }}>
              <Text style={{ fontWeight: '800'}}>statistic</Text>
            </XStack>
          </Link>
          <Text>По абонименту:  {counters.subscribers}</Text>
          <Text>Разовое:  {counters.unSubscribers}</Text>
          <Text>Sarvasya:  {counters.visitors}</Text>
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
          />
        </XStack>

        {/* Заголовок таблицы */}
        <XStack
          width="100%"
          style={{
            justifyContent: "space-between",
            backgroundColor: "gray3",
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
          }}
        >
          <Text flex={1} style={{ textAlign: "center", fontWeight: "bold" }}>
            nāma
          </Text>
          <Text flex={1} style={{ textAlign: "center", fontWeight: "bold" }}>
            Оплачено занятий
          </Text>
          <Text flex={1} style={{ textAlign: "center", fontWeight: "bold" }}>
            Сегодня
          </Text>
        </XStack>

        {/* Список студентов */}
        <YStack flex={1} width="100%">
          <FlashList
            ref={listRef}
            data={filteredStudents}
            estimatedItemSize={50}
            renderItem={({ item }) => (
              <XStack
                width="100%"
                style={{
                  borderBottomColor: "gray3",
                  borderBottomWidth: 1,
                  padding: 12,
                  minHeight: 32,
                  alignItems: "center",
                }}
              >
                <Text flex={1} style={{ textAlign: "left" }}>
                  {item.name}
                </Text>
                <Text flex={1} style={{ textAlign: "center" }}>
                  {item.paidLessons ?? 0}
                </Text>
                <XStack
                  flex={1}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Pressable
                  onPress={() => handleToggleCheck(item.id)}
                  // hitSlop={{ top: 1, bottom: 1, left: 1, right: 1 }} 
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}> */}
                  <Checkbox
                    style={{
                      height: 20,
                      width: 20,
                      borderColor: visited[item.id] ? "#3498db" : "#aaa",
                      borderWidth: 1,
                      borderRadius: 3,
                      backgroundColor: visited[item.id] ? "#e6f7ff" : "white",
                    }}
                    onCheckedChange={
                      () => handleToggleCheck(item.id)
                      // Обновление состояния посещаемости
                      // Например: updateAttendance(item.id, isChecked);
                    }
                  >
                    <Checkbox.Indicator>
                      <View
                        style={{
                          width: 14,
                          height: 14,
                          backgroundColor: visited[item.id]
                            ? "#34c2db"
                            : "green",
                          borderRadius: 2,
                        }}
                      />
                    </Checkbox.Indicator>
                  </Checkbox>
                  {/* </Pressable> */}
                </XStack>
              </XStack>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
