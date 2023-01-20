import { collection, getDocs, query, where } from "firebase/firestore";
import { ToastAndroid } from "react-native";
import { database, storage } from "../firebaseConfig";

const handleParentlogin = async (values, collectionName, institute) => {
  const userCollection = collection(database, collectionName);
  const q = query(
    userCollection,
    where("nationalIdentityNumber", "==", values.nationalIdentityNumber),
    where("password", "==", values.password),
    where("institute", "==", institute)
  );

  const userSnapshot = await getDocs(q);

  const user = userSnapshot.docs.map((user) => ({
    id: user.id,
    ...user.data(),
  }));

  if (user.length === 0)
    return ToastAndroid.show("Invalid Id or Password.", ToastAndroid.SHORT);

  console.log("User", user);

  return user[0];
};

export { handleParentlogin };
