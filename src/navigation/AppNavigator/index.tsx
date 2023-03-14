import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Classes } from "../../screens/Home";
import ProfileStack from "./ProfileStack";
import colors from "../../utils/colors";
import { EditProfile, Profile, Settings } from "../../screens/Profile";
import { View } from "react-native";
const STACK = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <STACK.Navigator
      initialRouteName="Classes"
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerShadowVisible: false,
      }}
    >
      <STACK.Screen name="Classes" component={Classes} />
      <STACK.Screen name="Profile" component={Profile} />
      <STACK.Screen name="Settings" component={Settings} />
      <STACK.Screen name="Edit Profile" component={EditProfile} />
    </STACK.Navigator>
  );
}
