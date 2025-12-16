import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import ProductListScreen from "../screens/Inventory/ProductListScreen";
import AddProductScreen from "../screens/Inventory/AddProductScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

const ProductsStack = () => {
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
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen
        name="ProductForm"
        component={AddProductScreen}
        options={{ title: 'Add Product' }}
      />
    </Stack.Navigator>
  );
};


export default ProductsStack