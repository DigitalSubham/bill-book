import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../types';

interface CustomersState {
  list: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  list: [],
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.list = action.payload;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.list.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.list.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(c => c.id !== action.payload);
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
  setCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setLoading,
  setError,
} = customersSlice.actions;

export default customersSlice.reducer;
