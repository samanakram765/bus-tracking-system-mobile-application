import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import { colors } from "../config";
import BusDetails from "../screens/BusDetails";
import ChatsScreen from "../screens/ChatsScreen";
import DriverProfile from "../screens/Parent/DriverProfile";
import MyProfile from "../screens/MyProfile";
import UpdateInformation from "../screens/UpdateInformation";
import AppNavigator from "./AppNavigator";
import StudentsListScreen from "../screens/Driver/StudentsListScreen";
import ShowStudentProfile from "../screens/ShowStudentProfile";
import {
  QRCodeScanner,
  ParentStudentAttendanceRecord,
} from "../screens/Parent";
import NotificationsScreen from "../screens/NotificationsScreen";
import StudentList from "../screens/Parent/StudentList";
import AttendanceRecrod from "../screens/AttendanceRecrod";
import { Text, TouchableOpacity } from "react-native";
import Icon from "../components/Icon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { color: colors.purple },
        // gestureEnabled: true,
        // gestureDirection: "horizontal",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardShadowEnabled: true,
        cardStyle: { elevation: 5 },
      }}
    >
      <Stack.Screen
        name="App"
        component={AppNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatsScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="StudentProfile" component={ShowStudentProfile} />
      <Stack.Screen name="StudentList" component={StudentsListScreen} />
      <Stack.Screen name="ParentStudentList" component={StudentList} />
      <Stack.Screen name="DriverProfile" component={DriverProfile} />
      <Stack.Screen name="BusDetails" component={BusDetails} />
      <Stack.Screen name="Update" component={UpdateInformation} />
      <Stack.Screen name="QRCode" component={QRCodeScanner} />
      <Stack.Screen
        name="Attendance"
        options={{
          headerRightContainerStyle: { paddingHorizontal: 20 },
          headerRight: () => (
            <TouchableOpacity onPress={() => setSidebar(true)}>
              <Icon
                IconComponent={MaterialCommunityIcons}
                name="dots-horizontal"
                color="black"
                style={{ margigRight: 20 }}
              />
            </TouchableOpacity>
          ),
        }}
      >
        {() => <AttendanceRecrod sidebar={sidebar} setSidebar={setSidebar} />}
      </Stack.Screen>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
