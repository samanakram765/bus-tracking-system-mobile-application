import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../firebaseConfig";

const getChatConversation = async (collection, userId, receiverId) => {
  const q = query(collection, where("conversation", "array-contains", userId));

  const snapshot = await getDocs(q);
  const conversations = snapshot.docs.map((snapshot) => ({
    conversationId: snapshot.id,
    ...snapshot.data(),
  }));

  const conversation = conversations.filter((convo) => {
    if (
      convo.conversation.includes(receiverId) &&
      convo.conversation.includes(userId)
    )
      return convo;
  });

  return conversation;
};

export const createChatConversation = async (data, user, receiver) => {
  const conversationCollection = collection(database, "conversation");

  const convo = await getChatConversation(
    conversationCollection,
    user.id,
    receiver.id
  );

  if (convo.length === 0) {
    const result = await addDoc(conversationCollection, data);

    return {
      conversationId: result.id,
      ...data,
    };
  }

  return convo[0];
};

export const createConversation = async (user, receiver) => {
  try {
    const data = {
      conversation: [user.id, receiver.id],
    };
    const conversation = await createChatConversation(data, user, receiver);

    return conversation;
  } catch (error) {
    console.log(error);
  }
};

export const send = async (data) => {
  const messagesCollections = collection(database, "messages");
  await addDoc(messagesCollections, data);
};

export const unReadMessages = async (sender, conversation) => {
  try {
    const notificationsCollection = collection(database, "notifications");
    const q = query(
      notificationsCollection,
      where("messageRead", "==", false),
      where("senderId", "==", sender.id),
      where("conversationId", "==", conversation.conversationId)
    );
    const unReadMessagesSnapshot = await getDocs(q);
    const unReadMessages = unReadMessagesSnapshot.docs.map((message) => ({
      id: message.id,
      ...message.data(),
    }));

    return unReadMessages;
  } catch (error) {
    console.log("Notifications ERROR: ", error);
  }
};

export const messageNotifications = async (data) => {
  const notificationCollection = collection(database, "notifications");
  await addDoc(notificationCollection, data);
};
