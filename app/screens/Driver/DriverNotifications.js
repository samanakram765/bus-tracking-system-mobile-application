import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";

import ListItem from "../../components/ListItem";
import Seperator from "../../components/Seperator";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";
import { useApi } from "../../hooks/useApi";
import { getParents } from "../../firebase/firebaseCalls/admin";
import Loader from "../../components/Loader";

const DriverNotifications = ({ user, setUser }) => {
  const notifications = [
    {
      id: 1,
      label: "Traffic Jam",
      description: "There might be some delay in bus arrival",
    },
    {
      id: 2,
      label: "Mechanical issue",
      description: "There might be some delay in bus arrival",
    },
    {
      id: 3,
      label: "Route Changed",
      description: "Route is changed due to traffic Jam",
    },
    {
      id: 4,
      label: "Bad Weather",
      description: "There might be some delay in Bus arrival",
    },
    { id: 5, label: "Help!", description: "Unexpected incident" },
  ];
  console.log(Timestamp.now());
  const { data, loading, request } = useApi(getParents);

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

  const sendAlert = async (item) => {
    let parent = true;
    if (item.id === 5) parent = false;

    const alertCollection = collection(database, "alert");
    const notificationCollection = collection(database, "notifications");
    await addDoc(alertCollection, {
      title: item.label,
      description: item.description,
      parent: parent,
      admin: true,
      institute: user.institute,
      busNo: user.busNo,
      created_at: serverTimestamp(),
    });

    const q = query(
      notificationCollection,
      where("institute", "==", user.institute),
      where("alert", "==", true),
      where("messageRead", "==", false)
    );

    const notificationSnapshot = await getDocs(q);
    console.log("Alerts snap", notificationSnapshot.empty);
    const notifications = notificationSnapshot.docs.map((notification) => ({
      id: notification.id,
      ...notification.data(),
    }));

    alert("Alert Sent");
    console.log("Notifications : ", notifications);
    const alertData = {
      parent: parent,
      admin: true,
      institute: user.institute,
      alert: true,
      messageRead: false,
      created_at: serverTimestamp(),
      data: [],
    };

    const dataNotification = {
      title: item.label,
      description: item.description,
      busNo: user.busNo,
    };

    if (notifications.length > 0) {
      // update the doc
      alertData.data = [...notifications[0].data, dataNotification];
      const docRef = doc(database, "notifications", notifications[0].id);

      await updateDoc(docRef, alertData);
    } else {
      alertData.data = [dataNotification];
      await addDoc(notificationCollection, alertData);
    }

    if (parent === 5) return;
    await Promise.all(
      data.map(async (parent) => {
        if (parent.pushToken && parent.isLoggedIn)
          await sendPushNotification(
            parent.pushToken,
            item.label,
            item.description
          );
      })
    );
  };

  useEffect(() => {
    request(user);
  }, []);

  if (loading) return <Loader />;

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          label={item.label}
          onPress={() => sendAlert(item)}
          description={item.description}
          rightIcon="chevron-right"
        />
      )}
      ItemSeparatorComponent={Seperator}
    />
  );
};

export default DriverNotifications;

const styles = StyleSheet.create({});
