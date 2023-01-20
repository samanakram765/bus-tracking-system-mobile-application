import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from "./app/navigation/MainNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/context/AuthContext";
import useAppFonts from "./app/hooks/useAppFonts";
import myTheme from "./app/theme/theme";
import { getSession } from "./app/storage/storeSession";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [user, setUser] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const { fontsLoaded } = useAppFonts();

  const getUserSession = async () => {
    const userSession = await getSession();
    setUser(userSession);
    setAppIsReady(true);
  };

  useEffect(() => {
    getUserSession();
  }, []);

  if (!appIsReady || !fontsLoaded) return null;

  return (
    <>
      <StatusBar style="auto" />
      <AuthContext.Provider value={{ user, setUser }}>
        <NavigationContainer theme={myTheme}>
          {user ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
    </>
  );
}
