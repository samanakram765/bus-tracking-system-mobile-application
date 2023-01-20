import { StyleSheet, View } from "react-native";

const Seperator = () => {
  return <View style={styles.line}></View>;
};

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#ededed",
  },
});

export default Seperator;
