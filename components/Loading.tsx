import { SafeAreaView } from "react-native";
import { Text } from "tamagui";
import { OmIcon } from "./OmIcon";

export const LoadingElement = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <OmIcon />
      <Text>загрузка...</Text>
    </SafeAreaView>
  );
};
