import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productSlice';
import customersReducer from './slices/customersSlice';
import invoicesReducer from './slices/invoicesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    customers: customersReducer,
    invoices: invoicesReducer,
    auth: authReducer, // Ensure authReducer is imported and added here
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
