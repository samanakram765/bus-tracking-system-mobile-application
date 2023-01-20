import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../config/colors";
import fonts from "../config/fonts";

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return <Text style={styles.error}>{error}</Text>;
};
const styles = StyleSheet.create({
  error: {
    fontSize: 18,
    color: colors.danger,
    fontFamily: fonts.PoppinsRegular,
  },
});

export default ErrorMessage;
