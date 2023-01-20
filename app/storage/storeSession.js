import * as SecureStore from "expo-secure-store";

const authKey = "auth";

const saveSession = async (value) => {
  try {
    await SecureStore.setItemAsync(authKey, JSON.stringify(value));
  } catch (error) {
    console.log("ERROR STORING SESSION", error);
  }
};

const getSession = async () => {
  try {
    const value = await SecureStore.getItemAsync(authKey);
    return JSON.parse(value);
  } catch (error) {
    console.log("ERROR GETTING SESSION", error);
  }
};

const removeSession = async () => {
  try {
    await SecureStore.deleteItemAsync(authKey);
  } catch (error) {
    console.log("ERROR REMOVING SESSION", error);
  }
};

export { getSession, removeSession, saveSession };
