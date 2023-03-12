import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditProfile, Profile } from '../../screens/Profile';
import Settings from '../../screens/Profile/Settings/index';
const STACK = createNativeStackNavigator();

export default function ProfileStack() {
    return (
        <STACK.Navigator>
            <STACK.Screen name="Profile" component={Profile} />
            <STACK.Screen name="Settings" component={Settings} />
            <STACK.Screen name="Settings" component={EditProfile} />
        </STACK.Navigator>
    );
}