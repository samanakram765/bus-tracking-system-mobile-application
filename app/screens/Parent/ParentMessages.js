import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import AppText from "../../components/AppText";
import ListItem from "../../components/ListItem";
import Screen from "../../components/Screen";
import Seperator from "../../components/Seperator";
import AuthContext from "../../context/AuthContext";

import { defaultStyles } from "../../config";
import { getAdmins, getParentChats } from "../../firebase/firebaseCalls/admin";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/Loader";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";

const ParentMessages = ({ navigation, user, setUser }) => {
  const { data, loading, request } = useApi(getParentChats);
  const [messagesNumber, setMessagesNumber] = useState(0);
  console.log("Chats  : ", data);
  const handleReadMesasge = async (person) => {
    console.log("Person  : ", person);
    if (!person.messageNumberId) return;
    const docRef = doc(database, "notifications", person.messageNumberId);
    await updateDoc(docRef, { messageRead: true });
  };

  const getMessagesNumber = async () => {
    const messagesCollection = collection(database, "notifications");
    const q = query(
      messagesCollection,
      where("notificationReceive", "==", user.institute),
      where("receiverId", "==", user.id),
      where("messageRead", "==", false)
    );

    onSnapshot(q, (messagesSnapshot) => {
      const chat = messagesSnapshot.docs.map((messagesNum) => ({
        id: messagesNum.id,
        ...messagesNum.data(),
      }));
      console.log("Messages", chat);
      setMessagesNumber(chat);
    });
  };

  useEffect(() => {
    getMessagesNumber();
    request(user);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Screen>
        <AppText style={[defaultStyles.heading, styles.heading]}>
          Messages
        </AppText>
        <Seperator />
        <FlatList
          data={data}
          keyExtractor={(message) => message.id.toString()}
          renderItem={({ item }) => {
            item.messagesCount = 0;
            item.messageNumberId = "";
            messagesNumber.forEach((messagesNum) => {
              if (messagesNum.senderId === item.id) {
                item.messagesCount = messagesNum.data.length;
                item.messageNumberId = messagesNum.id;
              }
            });

            return (
              <View style={styles.ListItemContainer}>
                <ListItem
                  image={item.image}
                  label={
                    item.fullName
                      ? item.fullName
                      : `${item.firstname} ${item.lastname}`
                  }
                  description={item.designation || "driver"}
                  rightIcon="chevron-right"
                  messagesCount={item.messagesCount}
                  onPress={() => {
                    navigation.navigate("Chat", { chatPerson: item });
                    handleReadMesasge(item);
                  }}
                />
              </View>
            );
          }}
          ItemSeparatorComponent={Seperator}
        />
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
  },
  ListItemContainer: {
    padding: 5,
    paddingHorizontal: 10,
  },
});

export default ParentMessages;
