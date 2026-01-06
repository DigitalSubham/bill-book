import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import BusinessSettingsScreen from "../screens/Settings/BusinessSettingsScreen";
import UserManagement from "../screens/Settings/UserManagement";
import SettingsScreen from "../screens/Settings/Settings";
import { AddUserScreen } from "../screens/Settings/AddUser";

const Stack = createNativeStackNavigator<RootStackParamList>();
const SettingsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: '#a864f1ff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="SettingsHome"
                component={SettingsScreen}
                options={{ title: "Settings" }}
            />
            <Stack.Screen
                name="BusinessSettings"
                component={BusinessSettingsScreen}
                options={{
                    headerShown: true,
                    title: 'Business Profile',
                    headerStyle: { backgroundColor: '#a864f1ff' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            />
            <Stack.Screen
                name="UserManagement"
                component={UserManagement}
                options={{ title: 'User Management' }}
            />
            <Stack.Screen
                name="UserForm"
                component={AddUserScreen}
                options={{ title: 'Add User' }}
            />

        </Stack.Navigator>
    );
};


export default SettingsStack;