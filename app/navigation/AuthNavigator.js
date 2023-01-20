import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import Login from "../screens/Login";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationDuration: 10,
      gestureEnabled: true,
      gestureDirection: "horizontal",
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardShadowEnabled: true,
      cardStyle: { elevation: 5 },
    }}
  >
    <Stack.Screen name="Welcome" component={HomeScreen} />
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);

export default AuthNavigator;
