import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import DashboardScreen from "../screens/Dashboard";
import SettingsStack from "./SettingsNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();
const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsStack}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};


export default DashboardStack;