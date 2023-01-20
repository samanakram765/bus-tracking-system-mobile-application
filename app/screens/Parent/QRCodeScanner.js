import { Button, StyleSheet, ActivityIndicator, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import moment from "moment";

import { database } from "../../firebase/firebaseConfig";
import {
  updateDoc,
  doc,
  setDoc,
  getDoc,
  collection,
  where,
  getDocs,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import AuthContext from "../../context/AuthContext";
import { colors } from "../../config";

const QRCodeScanner = () => {
  const { user } = useContext(AuthContext);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [institute, setInsitute] = useState({});
  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.getPermissionsAsync();
    if (status === "granted") return true;
    else {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status === "granted") return true;
      return false;
    }
  };

  const getStudent = async (scannedData) => {
    console.log("Scanned Data : ", scannedData);
    const studentRef = doc(database, "students", scannedData.studentId);
    const docSnap = await getDoc(studentRef);
    let onAndOffBoard = docSnap.get("onAndOffBoard");

    if (onAndOffBoard === true) return false;
    return true;
  };

  const getInstitute = async () => {
    const instituteCollection = collection(database, "institute");

    const q = query(
      instituteCollection,
      where("institute", "==", user.institute)
    );
    const instituteSnapshot = await getDocs(q);
    const institute = instituteSnapshot.docs.map((institute) => ({
      id: institute.id,
      ...institute.data(),
    }));

    setInsitute(institute[0]);
  };

  async function sendPushNotification(expoPushToken, title, body) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
      data: { someData: "goes here" },
    };

    console.log("TOken ,", message);
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      mode: "no-cors",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    if (!data.includes("studentId"))
      return alert("Sorry! this QR Code is invalid.");
    try {
      const scannedData = JSON.parse(data);

      console.log("Scanned Data : ", scannedData);
      if (
        scannedData.institute !== user.institute ||
        scannedData.busNo !== user.busNo
      )
        return alert("Sorry! this QR Code is invalid.");

      const day = moment().day();
      console.log("Day sent : ", day);
      if (day === 7) return alert("School is not open today");
      setLoading(true);

      const onAndOffBoard = await getStudent(scannedData);

      const openingTime = moment(institute.openingTime, "h:mm A");
      const closingTIme = moment(institute.closingTime, "h:mm A");
      const time2 = moment();
      const duration = moment.duration(time2.diff(openingTime));
      const duration2 = moment.duration(time2.diff(closingTIme));
      const month = moment().month() + 1;
      const year = moment().year();
      const date = moment().format("DD/MM/YYYY");
      console.log("MOnth and year : ", month, year);

      const minutes = duration.asMinutes();
      const minutes2 = duration2.asMinutes();

      if (!onAndOffBoard && minutes < 0) {
        setLoading(false);
        return alert(`${scannedData.rollNo} cannot be off boarded now.`);
      }
      if (onAndOffBoard) {
        if (minutes > 0 && minutes2 < 0) {
          setLoading(false);
          return alert("This is not a closing time now.");
        }
      }
      const attendanceCollection = collection(database, "attendance");
      const q = query(
        attendanceCollection,
        where("institute", "==", scannedData.institute),
        where("fatherNID", "==", scannedData.fatherNID),
        where("date", "==", date)
      );
      const attendanceDocs = await getDocs(q);

      const attendance = attendanceDocs.docs.map((attendance) => ({
        id: attendance.id,
        ...attendance.data(),
      }));

      if (attendance[0]?.closingTime?.offBoard) {
        setLoading(false);
        return alert(
          "You cannot mark this student attendance. Wait for tommorow."
        );
      }

      const docRef = doc(database, "students", scannedData.studentId);
      await updateDoc(docRef, {
        onAndOffBoard,
        date,
        timeOnAndOffBoard: serverTimestamp(),
      });

      const student = await getDoc(docRef);

      const attendanceData = {
        institute: user.institute,
        busNo: user.busNo,
        openingTime: {},
        closingTime: {},
        firstname: student.get("firstname"),
        lastname: student.get("lastname"),
        rollNo: student.get("rollNo"),
        fatherNID: student.get("fatherNID"),
        driverName: user.firstname,
        timeAndDate: serverTimestamp(),
        date,
        month: String(month),
        year,
      };

      if (attendance.length === 0) {
        attendanceData.openingTime.onBoard = moment().format("hh:mm A");
        await addDoc(attendanceCollection, attendanceData);
      } else {
        console.log("Attendance : ", attendance);
        const attendanceData = {
          ...attendance[0],
        };
        if (!attendance[0]?.openingTime?.offBoard) {
          attendanceData.openingTime.offBoard = moment().format("hh:mm A");
        } else if (!attendance[0]?.closingTime?.onBoard) {
          attendanceData.closingTime.onBoard = moment().format("hh:mm A");
        } else if (!attendance[0]?.closingTime?.offBoard) {
          attendanceData.closingTime.offBoard = moment().format("hh:mm A");
        }

        const docRef = doc(database, "attendance", attendance[0].id);
        await updateDoc(docRef, { ...attendanceData });
      }

      // if (minutes < 0) {
      //   console.log("Minutes : ", minutes);
      //   attendanceData.openingTime.onBoard = true;
      //   attendanceData.openingTime.offBoard = false;
      // }
      // if (minutes > 0) {
      //   attendanceData.openingTime.offBoard = true;
      //   attendanceData.openingTime.onBoard = false;
      // }
      // if (minutes > 0 && minutes2 > 0) {
      //   if (onAndOffBoard) {
      //     attendanceData.closingTime.onBoard = true;
      //     attendanceData.closingTime.offBoard = false;
      //   } else {
      //     attendanceData.closingTime.onBoard = false;
      //     attendanceData.closingTime.offBoard = true;
      //   }
      // }
      console.log("attendance : ", attendanceData);

      if (attendance.length === 0) {
      } else {
      }

      const message = onAndOffBoard
        ? `${scannedData.rollNo} is on-Boarded.`
        : `${scannedData.rollNo} is off-Boarded.`;
      alert(message);
      setLoading(false);
      const pushNotificationToken = await getParent(scannedData);

      if (pushNotificationToken) {
        await sendPushNotification(
          pushNotificationToken,
          "Student Board",
          message
        );
      }
    } catch (error) {
      setLoading(false);
      alert("Something went wrong while scanning QR");
      console.log("ERROR SCANNING BAR CODE :", error);
    }
  };

  const getParent = async (scannedData) => {
    const parentCollection = collection(database, "parent");
    const q = query(
      parentCollection,
      where("nationalIdentityNumber", "==", scannedData.fatherNID)
    );
    const parentSnapshot = await getDocs(q);

    const parent = parentSnapshot.docs.map((parent) => ({
      id: parent.id,
      ...parent.data(),
    }));

    console.log("Getting parent : ", parent);
    return parent[0]?.pushToken;
  };

  useEffect(() => {
    getBarCodeScannerPermissions();
    getInstitute();
  }, []);

  return (
    <>
      {loading && (
        <ActivityIndicator
          style={{ position: "absolute", top: "50%", left: "45%", zIndex: 999 }}
          size="large"
          color={colors.purple}
        />
      )}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          <Button
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        </View>
      )}
    </>
  );
};

export default QRCodeScanner;

const styles = StyleSheet.create({});
