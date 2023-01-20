import React, { useContext } from "react";

import AuthContext from "../context/AuthContext";
import DriverLocation from "./Driver/DriverLocation";
import ParentLocation from "./Parent/ParentLocation";

const Maps = (props) => {
  const { user, setUser } = useContext(AuthContext);

  if (user.loginUser === "drivers")
    return <DriverLocation user={user} setUser={setUser} {...props} />;

  return <ParentLocation user={user} setUser={setUser} {...props} />;
};

export default Maps;
