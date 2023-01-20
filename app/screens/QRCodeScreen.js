import { StyleSheet } from "react-native";
import React, { useContext } from "react";

import { QRCodeData } from "./Driver";
import AuthContext from "../context/AuthContext";
import { QRCodeScanner } from "./Parent";

const QRCodeScreen = (props) => {
  const { user, setUser } = useContext(AuthContext);
  if (user.loginUser === "drivers")
    return <QRCodeData {...props} user={user} setUser={setUser} />;

  return <QRCodeScanner {...props} user={user} setUser={setUser} />;
};

export default QRCodeScreen;

const styles = StyleSheet.create({});
