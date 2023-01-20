import { database } from "../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

export const getInstitutes = async () => {
  const instituteRef = collection(database, "institute");

  const instituteSnapshot = await getDocs(instituteRef);
  let institutes = instituteSnapshot.docs.map((institute) => ({
    id: institute.get("institute"),
    value: institute.get("institute"),
    label: institute.get("institute"),
  }));

  institutes = institutes.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  );

  return institutes;
};
