import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import fonts from "../config/fonts";

const AppButton = ({
  title,
  onPress,
  style,
  titleStyles,
  buttonColor = colors.purple,
  IconComponent,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.button, style, { backgroundColor: buttonColor }]}>
        {title && <Text style={[styles.text, titleStyles]}>{title}</Text>}
        {IconComponent}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingVertical: 15,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontFamily: fonts.PoppinsBold,
    color: colors.white,
    letterSpacing: 1,
  },
});

export default AppButton;
