import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
// import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import Seperator from "../components/Seperator";
import { colors } from "../config";
import Message from "../components/Message";
import AppButton from "../components/AppButton";
import Icon from "../components/Icon";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import {
  createConversation,
  messageNotifications,
  send,
  unReadMessages,
} from "../firebase/firebaseCalls/chat";
import { useConversation } from "../hooks/useConversation";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../firebase/firebaseConfig";
import AppText from "../components/AppText";

const ChatsScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const textInput = useRef();
  const {
    id: receiverId,
    firstname,
    lastname,
    designation,
    fullName,
  } = route.params.chatPerson;

  console.log("Push token : ", route.params);
  const { conversation, requestConversation } =
    useConversation(createConversation);

  const getPersonChat = () => {
    setLoading(true);
    const chatCollections = collection(database, "messages");
    const q = query(
      chatCollections,
      where("conversationId", "==", conversation.conversationId),
      orderBy("createdAt", "asc")
    );
    onSnapshot(q, (chatSnapshot) => {
      const chats = chatSnapshot.docs.map((chat) => ({
        id: chat.id,
        ...chat.data(),
      }));
      setMessages(chats);
    });

    setLoading(false);
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

  const sendMessage = async () => {
    try {
      const data = {
        message: message,
        senderId: user.id,
        reveiverId: receiverId,
        conversationId: conversation.conversationId,
        createdAt: serverTimestamp(),
      };
      const messageNotification = {
        messageRead: false,
        notificationReceive: user.institute,
        receiverId: receiverId,
        conversationId: conversation.conversationId,
        senderId: user.id,
        data: [],
      };

      textInput.current.clear();
      await send(data);
      const { pushToken, isLoggedIn } = route?.params?.chatPerson;
      if (pushToken && isLoggedIn)
        sendPushNotification(pushToken, "New message", message);
      const unReadMessage = await unReadMessages(user, conversation);
      console.log("Messages Zaid Saleem: ", unReadMessage);

      delete data.createdAt;
      if (unReadMessage.length > 0) {
        // update the collection
        messageNotification.data = [...unReadMessage[0].data, data];

        const docRef = doc(database, "notifications", unReadMessage[0].id);

        await updateDoc(docRef, messageNotification);
        return;
      }
      messageNotification.data = [data];
      await messageNotifications(messageNotification);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    textInput.current?.focus();
    setLoading(true);
    requestConversation(user, route.params.chatPerson);
  }, []);

  useEffect(() => {
    if (conversation.conversationId) getPersonChat();
  }, [conversation]);

  return (
    <Screen>
      <View style={styles.chatHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Messages")}
        >
          <Icon
            IconComponent={MaterialCommunityIcons}
            color={colors.white}
            name="chevron-left"
            size={40}
          />
        </TouchableOpacity>
        <ListItem
          color={colors.white}
          label={fullName ? fullName : `${firstname} ${lastname}`}
          description={designation}
        />
      </View>
      <Seperator />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <AppText>Loading</AppText>
        </View>
      ) : (
        <FlatList
          data={[...messages].reverse()}
          inverted={true}
          onScroll={() => {
            !textInput.current.focus();
            Keyboard.dismiss();
          }}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(message) => message.id.toString()}
          renderItem={({ item }) => (
            <Message message={item.message} own={item.senderId === user.id} />
          )}
        />
      )}

      <View style={styles.messageInput}>
        <TouchableWithoutFeedback onPress={() => textInput.current.focus()}>
          <TextInput
            ref={textInput}
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholder="Write a message!"
            cursorColor={"purple"}
            onChangeText={(text) => setMessage(text)}
          />
        </TouchableWithoutFeedback>
        <AppButton
          style={styles.button}
          IconComponent={
            <Icon
              IconComponent={MaterialCommunityIcons}
              name="send"
              color={colors.white}
              size={20}
            />
          }
          onPress={sendMessage}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  chatHeader: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.purple,
  },
  messageInput: {
    padding: 5,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#00000000",
  },
  input: {
    padding: 0,
    borderRadius: 50,
    height: 50,
    marginHorizontal: 5,
    paddingLeft: 20,
    backgroundColor: colors.veryLightBlack,
    borderColor: colors.whiteSmoke,
    borderWidth: 1,
    elevation: 10,
    flex: 1,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
});

export default ChatsScreen;
