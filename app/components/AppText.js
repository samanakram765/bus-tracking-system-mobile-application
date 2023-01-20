import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { Children } from "react";
import fonts from "../config/fonts";
import colors from "../config/colors";

const AppText = ({ children, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.text, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontFamily: fonts.PoppinsRegular,
    color: colors.mediumBlack,
  },
});

export default AppText;
