import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, createTokens } from "tamagui";

export const config = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      color: "#444", // Тёмно-серый текст вместо чёрного
    },
  },
});

type CustomConfig = typeof config;

// ensure types work
declare module "tamagui" {
  interface TamaguiCustomConfig extends CustomConfig {}
}

export const tokens = createTokens({
  color: {
    text: "#444",
    primaryBlue: "#5D7AB5",
    secondaryBlue: "#8FD2E6",
    primaryRose: "#DFABCF",
    secondaryRose: "#F1CCE1",
    primaryYelow: "#EBCDA7",
  },
});
