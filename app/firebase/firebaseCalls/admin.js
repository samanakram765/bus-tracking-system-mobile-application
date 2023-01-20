import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../firebaseConfig";

export const getAdmins = async (user) => {
  const adminCollection = collection(database, "admin");
  const q = query(adminCollection, where("institute", "==", user.institute));

  const adminSnapshot = await getDocs(q);
  const admins = adminSnapshot.docs.map((admins) => ({
    id: admins.id,
    ...admins.data(),
  }));
  // .filter((admins) => admins.id !== user.id);
  return admins;
};

export const getParents = async (user) => {
  const parentCollection = collection(database, "parent");
  const q = query(
    parentCollection,
    where("institute", "==", user.institute),
    where("busNo", "==", user.busNo)
  );

  const parentSnapshot = await getDocs(q);
  const parents = parentSnapshot.docs.map((parent) => ({
    id: parent.id,
    ...parent.data(),
  }));
  return parents;
};

export const getDrivers = async (user) => {
  const driverCollection = collection(database, "drivers");
  const q = query(
    driverCollection,
    where("institute", "==", user.institute),
    where("busNo", "==", user.busNo)
  );

  const driverSnapshot = await getDocs(q);
  const drivers = driverSnapshot.docs.map((driver) => ({
    id: driver.id,
    ...driver.data(),
  }));
  return drivers;
};

export const getDriverChats = async (user) => {
  try {
    const result = await Promise.all([getAdmins(user), getParents(user)]);
    const chats = result.flat();

    return chats;
  } catch (error) {
    console.log("ERROR GETTING CHATS : ", error);
  }
};

export const getParentChats = async (user) => {
  try {
    const result = await Promise.all([getAdmins(user), getDrivers(user)]);
    const chats = result.flat();

    return chats;
  } catch (error) {
    console.log("ERROR GETTING CHATS : ", error);
  }
};
