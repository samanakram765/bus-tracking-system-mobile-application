import { useEffect, useRef, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      style={styles.backgroundImage}
      resizeMode="contain"
      source={require("../assets/home-screen.png")}
    >
      <View style={styles.buttonContainer}>
        <AppButton
          title="Login as Driver"
          style={styles.button}
          buttonColor="#25a2e0"
          onPress={() =>
            navigation.navigate("Login", {
              loginUser: "drivers",
            })
          }
        />
        <AppButton
          title="Login as Parent"
          style={styles.button}
          onPress={() =>
            navigation.navigate("Login", {
              loginUser: "parent",
            })
          }
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    borderRadius: 50,
    marginVertical: 5,
  },

  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    position: "absolute",
    top: 70,
    width: 150,
    height: 150,
  },
});

export default HomeScreen;
