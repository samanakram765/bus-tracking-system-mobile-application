import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { ParentStudentProfile } from "./Parent";
import { DriverStudentProfile } from "./Driver";

const ShowStudentProfile = (props) => {
  const { user, setUser } = useContext(AuthContext);
  console.log("User : ", user);
  if (user.loginUser === "parent")
    return <ParentStudentProfile {...props} user={user} setUser={setUser} />;

  return <DriverStudentProfile {...props} user={user} setUser={setUser} />;
};

export default ShowStudentProfile;
