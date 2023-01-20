import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";

import ListItem from "../../components/ListItem";
import { FlashList } from "@shopify/flash-list";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";
import Seperator from "../../components/Seperator";

const ParentNotifications = ({ user, setUser }) => {
  const [alerts, setAlerts] = useState([]);

  const getAlerts = async () => {
    const alertCollection = collection(database, "alert");

    const q = query(
      alertCollection,
      where("institute", "==", user.institute),
      where("parent", "==", true),
      where("busNo", "==", user.busNo),
      orderBy("created_at", "desc")
    );

    const alerts = await getDocs(q);
    const allAlerts = alerts.docs.map((alert) => ({
      id: alert.id,
      ...alert.data(),
    }));
    setAlerts(allAlerts);
  };

  console.log("Alerts : ", alerts);
  useEffect(() => {
    getAlerts();
  }, []);

  return (
    <FlashList
      data={alerts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          label={item.title}
          description={item.description}
          onPress={() => console.log("Read")}
          // rightIcon="chevron-right"
          created_at={item.created_at}
        />
      )}
      ItemSeparatorComponent={Seperator}
      estimatedItemSize={200}
    />
  );
};

export default ParentNotifications;

const styles = StyleSheet.create({});
