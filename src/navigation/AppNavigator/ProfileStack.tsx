import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EditProfile, Profile } from "../../screens/Profile";
import Settings from "../../screens/Profile/Settings/index";
const STACK = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <STACK.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="main"
    >
      <STACK.Screen name="main" component={Profile} />
      <STACK.Screen name="Settings" component={Settings} />
      <STACK.Screen name="EditProfile" component={EditProfile} />
    </STACK.Navigator>
  );
}
