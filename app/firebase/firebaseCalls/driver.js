import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../firebaseConfig";

export const getDriverDetails = async (user) => {
  const driverCollection = collection(database, "drivers");
  const q = query(
    driverCollection,
    where("busNo", "==", user.busNo),
    where("institute", "==", user.institute)
  );
  const driverSnapshot = await getDocs(q);
  const driver = driverSnapshot.docs.map((driver) => ({
    id: driver.id,
    ...driver.data(),
  }));
  return driver;
};
