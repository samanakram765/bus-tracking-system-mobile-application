import LottieView from "lottie-react-native";

const Loader = () => {
  return (
    <LottieView
      source={require("../assets/animations/loader2.json")}
      autoPlay
      loop
    />
  );
};

export default Loader;
