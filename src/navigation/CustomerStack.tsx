import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomerListScreen from "../screens/Clients/CustomerListScreen";
import { RootStackParamList, formTypeEnum } from "../types";
import AddCustomerScreen from "../screens/Clients/AddCustomerScreen";
import { buildHeaderOptions } from "./headerOptions";


const Stack = createNativeStackNavigator<RootStackParamList>();

const CustomersStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={({ navigation }) =>
          buildHeaderOptions({
            title: 'Customers',
            rightActions: [
              {
                icon: 'plus',
                onPress: () => navigation.navigate('CustomerForm', { formType: formTypeEnum.ADD }),
              },
            ],
          })}
      />
      <Stack.Screen
        name="CustomerForm"
        component={AddCustomerScreen}
        options={buildHeaderOptions({ title: 'Add Customer' })}
      />
    </Stack.Navigator>
  );
};

export default CustomersStack
