import { StyleSheet, Text, View } from "react-native";
import { colors } from "../config";

const Icon = ({
  IconComponent,
  name,
  size = 24,
  color = colors.lightBlack,
  style,
}) => {
  return <IconComponent style={style} name={name} size={size} color={color} />;
};

export default Icon;

const styles = StyleSheet.create({});
