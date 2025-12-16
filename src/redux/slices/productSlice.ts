import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import Realm from 'realm';

interface ProductsState {
  list: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  list: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.list = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.list.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
    updateStock: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const product = state.list.find(p => p.id === action.payload.productId);
      if (product) {
        product.stock -= action.payload.quantity;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  setLoading,
  setError,
} = productsSlice.actions;
export default productsSlice.reducer;

export const loadProducts = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const realm = await Realm.open({ schema: [ProductSchema] });
    const products = realm.objects('Product').map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      mrp: p.mrp,
      rate: p.rate,
      taxRate: p.taxRate,
      unit: p.unit,
      stock: p.stock,
      minStock: p.minStock,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    dispatch(setProducts(products as Product[]));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError((error as Error).message));
    dispatch(setLoading(false));
  }
};

export const saveProduct = (product: Product) => async (dispatch: any) => {
  try {
    const realm = await Realm.open({ schema: [ProductSchema] });
    realm.write(() => {
      realm.create('Product', product, Realm.UpdateMode.Modified);
    });
    dispatch(addProduct(product));
  } catch (error) {
    dispatch(setError((error as Error).message));
  }
};
