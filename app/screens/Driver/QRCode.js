import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";

import QRCode from "react-native-qrcode-svg";
import { useApi } from "../../hooks/useApi";
import { getStudentsId } from "../../firebase/firebaseCalls/students";

const QRCodeData = ({ user, setUser }) => {
  const { data, loading, request } = useApi(getStudentsId);

  console.log(data);
  useEffect(() => {
    request(user);
  }, []);

  return (
    <View style={styles.container}>
      <QRCode size={250} value={JSON.stringify(data)} />
    </View>
  );
};

export default QRCodeData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
