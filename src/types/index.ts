export type DatePickerType = 'invoice' | 'due';

export interface FormErrors {
  name?: string;
  mobile?: string;
  email?: string;
  gst_number?: string;
  pincode?: string;
}
export interface CustomerFormData {
  id?: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst_number: string;
  placeOfSupply: string;
  customerType: string;
  creditLimit: string;
  notes: string;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  mobile: string;
  email?: string;
  gst_number?: string;
  pan?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  upiId?: string;
  logo?: string;
}

export interface Product {
  id?: string;
  name: string;
  description?: string;
  mrp: string;
  category: string;
  rate: string;
  taxRate: number;
  unit: string;
  stock: number;
  minStock?: number;
  barcode?: string;
  hsnCode?: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  mrp: number;
  rate: number;
  taxRate: number;
  taxAmount: number;
  amount: number;
}

export interface Invoice {
  id?: string;
  invoiceNo?: number;
  customer: CustomerFormData;
  items: InvoiceItem[];
  subtotal: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  receivedAmount: number;
  invoiceDate: Date;
  dueDate: Date;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  createdAt?: Date;
}

export interface InvoiceTotals {
  subtotal: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
}

export interface DashboardStats {
  totalSales: number;
  totalInvoices: number;
  pendingAmount: number;
  lowStockItems: number;
  todaySales: number;
  monthSales: number;
}

export interface SalesData {
  date: string;
  amount: number;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: { phoneNumber: string };
  Dashboard: undefined;
  ProductList: undefined;
  ProductForm: { productId?: string; formType: string };
  CustomerList: undefined;
  CustomerForm: { customerId?: string; formType: string };
  InvoiceList: undefined;
  CreateInvoice: undefined;
  InvoicePreview: { invoice: Invoice; formType: string };
  InvoiceDetails: { invoiceId: string };
  BusinessSettings: undefined;
  Profile: undefined;
};
