import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import InvoiceListScreen from "../screens/Invoices/InvoiceListScreen";
import CreateInvoiceScreen from "../screens/Invoices/CreateInvoiceScreen";
import InvoicePreviewScreen from "../screens/Invoices/InvoicePreviewScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const InvoicesStack = () => {
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
        name="InvoiceList"
        component={InvoiceListScreen}
        options={{ title: 'Invoices' }}
      />
      <Stack.Screen
        name="CreateInvoice"
        component={CreateInvoiceScreen}
        options={{ title: 'Create Invoice' }}
      />
      <Stack.Screen
        name="InvoicePreview"
        component={InvoicePreviewScreen}
        options={{ title: 'Invoice Preview' }}
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
