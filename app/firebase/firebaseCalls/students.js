import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../firebaseConfig";

export const getSpecificStudent = async (user) => {
  const studentRef = collection(database, "students");
  const q = query(studentRef, where("rollNo", "==", user.studentId));
  const studentSnapshot = await getDocs(q);
  const student = studentSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(student);
  return student;
};

export const getParentStudents = async (user) => {
  const studentRef = collection(database, "students");
  const q = query(
    studentRef,
    where("institute", "==", user.institute),
    where("fatherNID", "==", user.nationalIdentityNumber)
  );
  const studentSnapshot = await getDocs(q);
  const student = studentSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(student);
  return student;
};

export const getStudents = async (user) => {
  const studentRef = collection(database, "students");

  const q = query(
    studentRef,
    where("institute", "==", user.institute),
    where("busNo", "==", user.busNo)
  );

  const studentSnapshot = await getDocs(q);
  const student = studentSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return student;
};

export const getStudentsId = async (user) => {
  const studentRef = collection(database, "students");

  const q = query(
    studentRef,
    where("institute", "==", user.institute),
    where("busNo", "==", user.busNo)
  );

  const studentSnapshot = await getDocs(q);
  const student = studentSnapshot.docs.map((doc) => ({
    id: doc.id,
    rollNo: doc.get("rollNo"),
  }));

  return student;
};
