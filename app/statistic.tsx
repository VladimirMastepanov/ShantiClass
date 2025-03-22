import { Button, Text, XStack, YStack } from "tamagui";
import { Link } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useSQLiteContext } from "expo-sqlite";

export default function ProfileScreen() {  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();


  return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack 
        flex={1}
        style={{
          alignItems: "center",
          paddingTop: insets.top + 10,
          paddingHorizontal: 16,
          gap: 8,
        }}>

          <Link href="/">
            <Text>Return to the visit log</Text>
          </Link>
          <Text>This is profile</Text>

        </YStack>
      </SafeAreaView>
    )

}
