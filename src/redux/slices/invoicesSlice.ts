import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from '../../types';

interface InvoicesState {
  list: Invoice[];
  nextInvoiceNo: number;
  loading: boolean;
  error: string | null;
}

const initialState: InvoicesState = {
  list: [],
  nextInvoiceNo: 1,
  loading: false,
  error: null,
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.list = action.payload;
      // Calculate next invoice number
      const maxInvoiceNo = Math.max(
        ...action.payload.map(inv => inv.invoiceNo),
        0,
      );
      state.nextInvoiceNo = maxInvoiceNo + 1;
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.list.push(action.payload);
      state.nextInvoiceNo += 1;
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.list.findIndex(inv => inv.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(inv => inv.id !== action.payload);
    },
    updateInvoiceStatus: (
      state,
      action: PayloadAction<{ id: string; status: Invoice['status'] }>,
    ) => {
      const invoice = state.list.find(inv => inv.id === action.payload.id);
      if (invoice) {
        invoice.status = action.payload.status;
      }
    },
    updatePayment: (
      state,
      action: PayloadAction<{ id: string; receivedAmount: number }>,
    ) => {
      const invoice = state.list.find(inv => inv.id === action.payload.id);
      if (invoice) {
        invoice.receivedAmount = action.payload.receivedAmount;
        if (invoice.receivedAmount >= invoice.totalAmount) {
          invoice.status = 'paid';
        } else if (invoice.receivedAmount > 0) {
          invoice.status = 'partial';
        }
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
  setInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  updatePayment,
  setLoading,
  setError,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;
