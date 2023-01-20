import { StyleSheet } from "react-native";

import fonts from "./fonts";

const styles = StyleSheet.create({
  heading: {
    fontSize: 40,
    fontFamily: fonts.PoppinsBold,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  listItemDescription: {
    fontSize: 16,
    fontFamily: fonts.PoppinsLight,
    fontStyle: "italic",
  },
  listItemTitle: {
    fontSize: 20,
    fontFamily: fonts.PoppinsRegular,
  },
});

export default styles;
