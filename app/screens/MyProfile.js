import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import DriverProfile from "./Driver/DriverProfile";
import ParentProfile from "./Parent/ParentProfile";

const MyProfile = (props) => {
  const { user, setUser } = useContext(AuthContext);
  console.log("User : ", user);
  if (user?.isParent)
    return <ParentProfile {...props} user={user} setUser={setUser} />;

  return <DriverProfile {...props} user={user} setUser={setUser} />;
};

export default MyProfile;
