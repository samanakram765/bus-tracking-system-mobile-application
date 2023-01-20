import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import DriverNotifications from "./Driver/DriverNotifications";
import ParentNotifications from "./Parent/ParentNotifications";

const NotificationsScreen = (props) => {
  const { user, setUser } = useContext(AuthContext);
  if (user.loginUser === "drivers")
    return <DriverNotifications user={user} setUser={setUser} {...props} />;

  return <ParentNotifications user={user} setUser={setUser} {...props} />;
};

export default NotificationsScreen;

const styles = StyleSheet.create({});
