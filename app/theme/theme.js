import { DefaultTheme } from "@react-navigation/native";
import { colors } from "../config";

const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

export default myTheme;
