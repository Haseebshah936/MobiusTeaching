import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { EditProfile, Profile, Settings } from "../../screens/Profile";
import {
  Announcement,
  Class,
  ClassSettings,
  Classes,
  Comments,
  CreateAnnouncement,
  CreateClass,
} from "../../screens/Home";
import colors from "../../utils/colors";

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
        // headerShadowVisible: false,
      }}
    >
      <STACK.Screen name="Classes" component={Classes} />
      <STACK.Screen name="CreateClass" component={CreateClass} />
      <STACK.Screen name="Class" component={Class} />
      <STACK.Screen name="Announcement" component={Announcement} />
      <STACK.Screen name="Class Settings" component={ClassSettings} />
      <STACK.Screen name="Comments" component={Comments} />
      <STACK.Screen name="Create Announcement" component={CreateAnnouncement} />
      <STACK.Screen name="Profile" component={Profile} />
      <STACK.Screen name="Settings" component={Settings} />
      <STACK.Screen name="Edit Profile" component={EditProfile} />
    </STACK.Navigator>
  );
}
