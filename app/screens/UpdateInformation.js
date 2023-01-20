import { StyleSheet, View, ToastAndroid, Image } from "react-native";
import React, { useContext, useRef, useState } from "react";

import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import AuthContext from "../context/AuthContext";
import { defaultStyles } from "../config";
import { selectImage, updateData } from "../firebase/firebaseCalls/parent";
import { saveSession } from "../storage/storeSession";
import { TextInput } from "react-native-paper";

const UpdateInformation = () => {
  const [password, setPassword] = useState("");
  const textInput = useRef("");
  const { user, setUser } = useContext(AuthContext);

  const uploadImage = async () => {
    const result = await selectImage(user);
    if (result === undefined)
      return ToastAndroid.show(
        "Error Occured while uploading Image",
        ToastAndroid.SHORT
      );

    ToastAndroid.show("Image Uploaded Successfully", ToastAndroid.SHORT);

    const updatedUser = {
      ...user,
      image: result,
    };

    console.log("Login user : ", user);
    const updateResult = await updateData(updatedUser, user.loginUser, user.id);

    if (updateResult === false)
      return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);

    setUser(updatedUser);
    await saveSession(updatedUser);
  };

  const updatePassword = async () => {
    const updatedUser = {
      ...user,
      password: password,
    };
    const result = await updateData(updatedUser, user.loginUser, user.id);
    if (result === false)
      return ToastAndroid.show(
        "Error Occured while updating password.",
        ToastAndroid.SHORT
      );

    ToastAndroid.show("Password Update Successfully.", ToastAndroid.SHORT);
    setUser(updatedUser);
    await saveSession(updatedUser);
    textInput.current.clear();
  };

  return (
    <Screen>
      <View style={styles.container}>
        {user.image && (
          <Image
            source={{ uri: user.image }}
            style={[defaultStyles.image, styles.image]}
          />
        )}
        {!user.image && (
          <Image
            source={require("../assets/profile-avatar.jpg")}
            style={[defaultStyles.image, styles.image]}
          />
        )}
        <AppButton
          title="Change Image"
          style={styles.button}
          titleStyles={styles.buttonTitle}
          onPress={uploadImage}
        />
      </View>
      <View style={styles.form}>
        <TextInput
          ref={textInput}
          mode="outlined"
          label="Password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="off"
          keyboardAppearance="default"
          keyboardType="default"
          textContentType="password"
          onChangeText={(text) => setPassword(text)}
        />

        <AppButton
          title="Update Password"
          style={styles.button}
          onPress={updatePassword}
        />
      </View>
    </Screen>
  );
};

export default UpdateInformation;

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonTitle: {
    fontSize: 15,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    padding: 20,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
});
