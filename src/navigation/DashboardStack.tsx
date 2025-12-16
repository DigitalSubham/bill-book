import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import BusinessSettingsScreen from "../screens/Settings/BusinessSettingsScreen";
import DashboardScreen from "../screens/Dashboard";

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
        name="BusinessSettings"
        component={BusinessSettingsScreen}
        options={{ title: 'Business Settings' }}
      />
    </Stack.Navigator>
  );
};


export default DashboardStack;