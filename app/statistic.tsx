import { Button, Text, XStack, YStack } from "tamagui";
import { Link } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { exportDb, importDb } from "../database/helpers.ts/backUpDb";
import { useStudentsContext } from "../context/studentsContext";
import { Diagram } from "../components/Diagram";
import { View } from "react-native";

export default function Tools() {
  const insets = useSafeAreaInsets();
  const { setShouldRefresh } = useStudentsContext();

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
          gap: 16,
        }}
      >
        <Link
          style={{
            backgroundColor: "#DFABCF",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 6,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          href="/"
        >
          <Text color="white">Return to the visit log</Text>
        </Link>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: 40,
            paddingBottom: 30,
          }}
        >
          <Diagram />
        </View>

        <XStack width="100%" style={{ marginBottom: 16 }}>
          <Button
            onPress={importDb}
            style={{
              flex: 1,
              backgroundColor: "#DFABCF",
              height: 40,
              paddingHorizontal: 12,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              marginRight: 8,
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
              backgroundColor: "#5D7AB5",
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
      </YStack>
    </SafeAreaView>
  );
}
