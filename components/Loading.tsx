import { SafeAreaView } from "react-native";
import { Text } from "tamagui";

export const LoadingElement = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text>Загрузка...</Text>
    </SafeAreaView>
  );
};
