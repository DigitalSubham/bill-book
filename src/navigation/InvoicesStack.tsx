import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import InvoiceListScreen from "../screens/Invoices/InvoiceListScreen";
import CreateInvoiceScreen from "../screens/Invoices/CreateInvoiceScreen";
import InvoicePreviewScreen from "../screens/Invoices/InvoicePreviewScreen";
import { buildHeaderOptions } from "./headerOptions";

const Stack = createNativeStackNavigator<RootStackParamList>();
const InvoicesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InvoiceList"
        component={InvoiceListScreen}
        options={({ navigation }) =>
          buildHeaderOptions({
            title: 'Invoices',
            rightActions: [
              {
                icon: 'plus',
                onPress: () => navigation.navigate('CreateInvoice'),
              },
            ],
          })}
      />
      <Stack.Screen
        name="CreateInvoice"
        component={CreateInvoiceScreen}
        options={buildHeaderOptions({ title: 'Create Invoice' })}
      />
      <Stack.Screen
        name="InvoicePreview"
        component={InvoicePreviewScreen}
        options={buildHeaderOptions({ title: 'Invoice Preview' })}
      />
      {/* <Stack.Screen
        name="InvoiceDetails"
        component={InvoicePreviewScreen}
        options={{ title: 'Invoice Details' }}
      /> */}
    </Stack.Navigator>
  );
};

export default InvoicesStack
