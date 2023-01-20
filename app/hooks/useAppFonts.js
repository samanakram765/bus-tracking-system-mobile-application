import { useFonts } from "expo-font";

export default function useAppFonts() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/SF-Mono-Font/Poppins-Bold.ttf"),
    "Poppins-Medium": require("../assets/SF-Mono-Font/Poppins-Medium.ttf"),
    "Poppins-Light": require("../assets/SF-Mono-Font/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/SF-Mono-Font/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/SF-Mono-Font/Poppins-SemiBold.ttf"),
  });

  return {
    fontsLoaded,
  };
}
