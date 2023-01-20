import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../config";
import Maps from "../screens/Maps";
import Icon from "../components/Icon";
import Messages from "../screens/Messages";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.purple,
      tabBarActiveBackgroundColor: colors.whiteSmoke,
      tabBarInactiveBackgroundColor: colors.white,
      tabBarLabelStyle: {
        fontSize: 12,
      },
    }}
  >
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({ size, color }) => (
          <Icon
            IconComponent={MaterialCommunityIcons}
            name="account"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Messages"
      component={Messages}
      options={{
        tabBarIcon: ({ size, color }) => (
          <Icon
            IconComponent={MaterialCommunityIcons}
            name="chat"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Maps"
      component={Maps}
      options={{
        tabBarIcon: ({ size, color }) => (
          <Icon
            IconComponent={MaterialCommunityIcons}
            name="map-marker-radius"
            color={color}
            size={size}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default AppNavigator;
