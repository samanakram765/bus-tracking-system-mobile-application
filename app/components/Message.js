import { StyleSheet, View, Dimensions } from "react-native";

import { colors } from "../config";
import AppText from "./AppText";

const Message = ({ own, message }) => {
  return (
    <View
      style={{
        alignItems: own ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={[
          styles.message,
          {
            borderTopLeftRadius: own ? 10 : 0,
            borderTopRightRadius: !own ? 10 : 0,
          },
        ]}
      >
        <AppText style={styles.messageText}>{message}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    backgroundColor: colors.purple,
    padding: 10,
    flexWrap: "wrap",
    maxWidth: Dimensions.get("screen").width / 1.5,
    marginVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginHorizontal: 5,
  },
  messageText: {
    fontSize: 18,
    color: colors.white,
  },
});

export default Message;
