import { useEffect, useMemo, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Checkbox, Input, Text, XStack, YStack } from "tamagui";
import { FlashList } from "@shopify/flash-list";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import STUDENTS from "../../STUDENTS.json";
import { StudentsDescription } from "../../types/dbTypes";

export default function ShantiClass() {
  const [loading, setLoading] = useState(true);
  const db = useSQLiteContext();
  const [students, setStudents] = useState<StudentsDescription[]>([]);

  const listRef = useRef<FlashList<StudentsDescription> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const insets = useSafeAreaInsets();
  const [visiters, setVisiters] = useState(0);
  const [subscribers, setSuscribers] = useState(0);
  const [unSubscribers, setUnsobscribers] = useState(0);

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
    setStudents(STUDENTS);
    setLoading(false)
  }, [db]);
  
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Загрузка...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />

        <YStack
          flex={1}
          px="$1"
          gap="$2"
          style={{ alignItems: "center", padding: insets.top + 10 }}
        >
          <XStack style={{ justifyContent: "space-between", width: '90%' }}>
            <Text>По абонименту: {subscribers}</Text>
            <Text>Разовое: {unSubscribers}</Text>
            <Text>Sarvasya: {visiters}</Text>
          </XStack>

          <XStack width="90%">
            <Input
              placeholder="om..."
              flex={1}
              value={searchTerm}
              onChangeText={(text) => setSearchTerm(text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </XStack>

           <XStack
            style={{justifyContent: 'space-between', padding: "$3",  backgroundColor: "$gray3", borderRadius: "$2"}}
            width="90%"

          >
            <Text fontWeight="bold" flex={1} style={{textAlign: 'center'}} >nāma</Text>
            <Text fontWeight="bold" flex={1} style={{textAlign: 'center'}}>Оплачено занятий</Text>
            <Text fontWeight="bold" flex={1} style={{textAlign: 'center'}}>Сегодня</Text>
          </XStack>


            <YStack flex={1} width='100%'>
          <FlashList
            ref={listRef}
            data={filteredStudents}
            estimatedItemSize={50}
            renderItem={({ item }) => (
              <XStack
                width="90%"
                gap="$2"
                
                
                style={{borderBottomColor: "$gray3", minHeight: "$3", alignItems: "center",
                padding: "$3",
                borderBottomWidth: 1}}
                
              >
                <Text flex={1} style={{textAlign: 'center'}} >{item.name}</Text>
                <Text flex={1} style={{textAlign: 'center'}} >{item.paidLessons ?? 0}</Text>
              </XStack>
            )}
            keyExtractor={(item) => item.id.toString()}
          />

            </YStack>
        </YStack>
    </SafeAreaView>

  );
}
