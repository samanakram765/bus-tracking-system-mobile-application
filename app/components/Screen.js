import { StyleSheet, View, StatusBar } from "react-native";

const Screen = ({ children, style }) => {
  return <View style={[styles.screen, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});

export default Screen;
