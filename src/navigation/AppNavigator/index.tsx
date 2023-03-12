import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Classes } from "../../screens/Home";
import ProfileStack from "./ProfileStack";
const STACK = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <STACK.Navigator>
      <STACK.Screen name="Classes" component={Classes} />
      <STACK.Screen name="Profile" component={ProfileStack} />
    </STACK.Navigator>
  );
}
