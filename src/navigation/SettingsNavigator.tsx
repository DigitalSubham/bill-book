import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import BusinessSettingsScreen from "../screens/Settings/BusinessSettingsScreen";
import UserManagement from "../screens/Settings/UserManagement";
import SettingsScreen from "../screens/Settings/Settings";
import { AddUserScreen } from "../screens/Settings/AddUser";
import { buildHeaderOptions } from "./headerOptions";
import { formTypeEnum } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const SettingsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SettingsHome"
                component={SettingsScreen}
                options={({ navigation }) =>
                    buildHeaderOptions({
                        title: "Settings",
                        rightActions: [
                            {
                                icon: 'store-cog-outline',
                                onPress: () => navigation.navigate('BusinessSettings'),
                            },
                        ],
                    })}
            />
            <Stack.Screen
                name="BusinessSettings"
                component={BusinessSettingsScreen}
                options={buildHeaderOptions({ title: 'Business Profile' })}
            />
            <Stack.Screen
                name="UserManagement"
                component={UserManagement}
                options={({ navigation }) =>
                    buildHeaderOptions({
                        title: 'User Management',
                        rightActions: [
                            {
                                icon: 'plus',
                                onPress: () => navigation.navigate('UserForm', { formType: formTypeEnum.ADD }),
                            },
                        ],
                    })}
            />
            <Stack.Screen
                name="UserForm"
                component={AddUserScreen}
                options={buildHeaderOptions({ title: 'Add User' })}
            />

        </Stack.Navigator>
    );
};


export default SettingsStack;
