import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

import { database, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const getSpecificParent = async (user) => {
  const parentRef = collection(database, "parent");
  const q = query(parentRef, where("parent_id", "==", user.uid));
  const parentSnapshot = await getDocs(q);
  const parent = parentSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return parent;
};

export const uploadProfileImage = async (image, user) => {
  try {
    let collectionName = "parent/";

    if (user.loginUser === "drivers") collectionName = "drivers/";
    const imageName = new Date().valueOf();

    const imageRef = ref(storage, collectionName + imageName);

    const response = await fetch(image.uri);
    const blob = await response.blob();

    const uploadTask = await uploadBytes(imageRef, blob);

    const downloadedURL = await getDownloadURL(uploadTask.ref);

    return downloadedURL;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const selectImage = async (user) => {
  const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

  if (permission.granted === false) {
    const requestPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (requestPermission.status === "denied") return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (result.cancelled) return;

  const uploadResult = await uploadProfileImage(result, user);

  if (uploadBytes === false) return;

  return uploadResult;
};

export const updateData = async (updatedUser, collectionName, id) => {
  try {
    const docRef = doc(database, collectionName, id);
    await updateDoc(docRef, updatedUser);
  } catch (error) {
    console.log(error);
    return false;
  }
};
