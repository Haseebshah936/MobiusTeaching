import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ForgotPassword, SignIn, SignUp } from "../../screens/Auth";

const STACK = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <STACK.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <STACK.Screen name="SignIn" component={SignIn} />
      <STACK.Screen name="SignUp" component={SignUp} />
      <STACK.Screen name="ForgotPassword" component={ForgotPassword} />
    </STACK.Navigator>
  );
}
