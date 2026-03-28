import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import DashboardScreen from "../screens/Dashboard";
import SettingsStack from "./SettingsNavigator";
import { buildHeaderOptions } from "./headerOptions";

const Stack = createNativeStackNavigator<RootStackParamList>();
const DashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={({ navigation }) => ({
          ...buildHeaderOptions({
            title: 'Dashboard',
            rightActions: [
              {
                icon: 'cog-outline',
                onPress: () => navigation.navigate('Settings'),
              },
            ],
          }),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};


export default DashboardStack;
