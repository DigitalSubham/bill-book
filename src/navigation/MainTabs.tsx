import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InvoicesStack from "./InvoicesStack";
import DashboardStack from "./DashboardStack";
import ProductsStack from "./productStack";
import CustomersStack from "./CustomerStack";


const Tab = createBottomTabNavigator();
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStack}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons name="package-variant" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="InvoicesTab"
        component={InvoicesStack}
        options={{
          tabBarLabel: 'Invoices',
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons name="file-document" color={color} size={size} />
          ),
          tabBarBadge: undefined, // Can add badge for pending invoices
        }}
      />
      <Tab.Screen
        name="CustomersTab"
        component={CustomersStack}
        options={{
          tabBarLabel: 'Customers',
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;