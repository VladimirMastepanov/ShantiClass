import { Button, getTokens, Text, XStack, YStack } from "tamagui";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSQLiteContext } from "expo-sqlite";

export default function ProfileScreen() {
  const tokens = getTokens();
  const db = useSQLiteContext();


  return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack>
          <Link href="/">
            <Text>Return to the visit log</Text>
          </Link>
          <Text>This is profile</Text>

        {/* </YStack>
        <YStack gap="$5">
          <Button onPress={handleClearUser}>Log Out</Button>
        </YStack>
        <YStack
          justifyContent="center"
          flex={1}
          gap="$6"
          paddingHorizontal={tokens.space.$2.val}
        >
          <XStack gap="$2">
            <StatsCard title="innerDay" value={user.innerDayCounter} unit="" />
            <StatsCard title="lastVisit" value={user.lastVisitDate} unit="" />
            <StatsCard title="id" value={user.id} unit="" />
          </XStack>
        </YStack>
        <YStack
          justifyContent="center"
          flex={1}
          gap="$6"
          paddingHorizontal={tokens.space.$2.val}
        >
          <XStack gap="$2">
            <StatsCard title="words" value={todos[0].done.toString()} unit="" />
            <StatsCard
              title="spaced"
              value={todos[1].done.toString()}
              unit=""
            />
            <StatsCard title="quiz" value={todos[2].done.toString()} unit="" />
          </XStack>
        </YStack>
        <YStack gap="$5">
          <Button onPress={() => setNextInnerDay(user.id)}>
            Set Next Inner Day
          </Button>
        </YStack>
        <YStack gap="$5">
          <Button onPress={() => setPreviousVisitDate(user.id)}>
            Set previous visit date
          </Button> */}


        </YStack>
      </SafeAreaView>
    )

}
