import { useState } from "react";

export const useConversation = (apiFunc) => {
  const [conversation, setConversation] = useState({});

  const requestConversation = async (...args) => {
    const result = await apiFunc(...args);

    setConversation(result);
  };

  return {
    requestConversation,
    conversation,
  };
};
