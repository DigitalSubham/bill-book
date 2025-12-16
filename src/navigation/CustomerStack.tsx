import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomerListScreen from "../screens/Clients/CustomerListScreen";
import { RootStackParamList } from "../types";
import AddCustomerScreen from "../screens/Clients/AddCustomerScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

const CustomersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#a864f1ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={{ title: 'Customers' }}
      />
      <Stack.Screen
        name="CustomerForm"
        component={AddCustomerScreen}
        options={{ title: 'Add Customer' }}
      />
    </Stack.Navigator>
  );
};

export default CustomersStack