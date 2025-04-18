import { Button, Text, XStack, YStack } from "tamagui";
import { Link } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useSQLiteContext } from "expo-sqlite";
import { exportDb, importDb } from "../database/helpers.ts/backUpDb";
import { useStudents } from "../context/studentsContext";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const { setShouldRefresh } = useStudents();

  const handleExportBd = async () => {
    await exportDb();
    setShouldRefresh(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack
        flex={1}
        style={{
          alignItems: "center",
          paddingTop: insets.top + 10,
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        <Link href="/">
          <Text>Return to the visit log</Text>
        </Link>
      </YStack>
      <XStack width="100%" style={{ marginBottom: 50 }}>
        <Button
          onPress={importDb}
          style={{
            flex: 1,
            backgroundColor: "tomato",
            height: 40,
            paddingHorizontal: 12,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
          }}
        >
          <XStack style={{ alignItems: "center" }} gap={4}>
            <Text color="white">Загрузить базу данных</Text>
          </XStack>
        </Button>
        <Button
          onPress={handleExportBd}
          style={{
            flex: 1,
            backgroundColor: "tomato",
            height: 40,
            paddingHorizontal: 12,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
          }}
        >
          <XStack style={{ alignItems: "center" }} gap={4}>
            <Text color="white">Сохранить базу данных</Text>
          </XStack>
        </Button>
      </XStack>
    </SafeAreaView>
  );
}
