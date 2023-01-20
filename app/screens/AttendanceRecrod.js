import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { ParentStudentAttendanceRecord } from "./Parent";
import { DriverStudentAttendanceRecord } from "./Driver";

const AttendanceRecrod = (props) => {
  const { user, setUser } = useContext(AuthContext);

  if (user.loginUser === "parent")
    return (
      <ParentStudentAttendanceRecord user={user} setUser={setUser} {...props} />
    );

  return (
    <DriverStudentAttendanceRecord user={user} setUser={setUser} {...props} />
  );
};

export default AttendanceRecrod;

const styles = StyleSheet.create({});
