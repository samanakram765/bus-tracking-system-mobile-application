import React, { useContext } from "react";
import ParentMessages from "./Parent/ParentMessages";
import AuthContext from "../context/AuthContext";
import DriverMessages from "./Driver/DriverMessages";

const Messages = (props) => {
  const { user, setUser } = useContext(AuthContext);

  console.log("User : ", user);
  if (user.loginUser === "parent")
    return <ParentMessages {...props} user={user} setUser={setUser} />;

  return <DriverMessages {...props} user={user} setUser={setUser} />;
};

export default Messages;
