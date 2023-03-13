import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateProfile } from "../../screens/Auth";

const STACK = createNativeStackNavigator();

export default function CreateProfileStack() {
  return (
    <STACK.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <STACK.Screen name="CreateProfile" component={CreateProfile} />
    </STACK.Navigator>
  );
}
