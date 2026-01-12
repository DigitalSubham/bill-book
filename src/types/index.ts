export type DatePickerType = 'invoice' | 'due';
export enum formTypeEnum {
  ADD = 'add',
  EDIT = 'edit',
  VIEW = 'view',
}
export type Nullable<T> = T | null | undefined;

export interface FormErrors {
  name?: string;
  mobile?: string;
  email?: string;
  gst_number?: string;
  pincode?: string;
}

export type UserRole = 'admin' | 'sales' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  permissions?: string[];
}

export interface CustomerBaseType {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst_number: string;
  gstNumber?: string;
  placeOfSupply: string;
  customerType: string;
  creditLimit: string;
  notes: string;
}

export interface CustomerType extends CustomerBaseType {
  id: string;
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

export interface ProductBaseType {
  name: string;
  description?: string;
  mrp: string;
  category: string;
  rate: string;
  taxRate: string;
  unit: string;
  stock: number;
  minStock?: number;
  barcode?: string;
  hsnCode?: string;
}

export interface ProductType extends ProductBaseType {
  id: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  mrp: string;
  sellingRate: string;
  taxRate: string;
  taxAmount: number;
  amount: number;
}

export interface InvoiceBase {
  invoiceNumber?: number;
  customer: CustomerType;
  items: InvoiceItem[];
  subtotal: number;
  taxableAmount: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal?: number;
  totalAmount: number;
  receivedAmount: number;
  invoiceDate: Date;
  dueDate: Date;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  createdAt?: Date;
}

export interface InvoiceType extends InvoiceBase {
  id?: string;
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
  ProductForm: { productId?: string; formType: formTypeEnum };
  CustomerList: undefined;
  CustomerForm: { customerId?: string; formType: formTypeEnum };
  InvoiceList: undefined;
  CreateInvoice: undefined;
  InvoicePreview: {
    invoice: InvoiceType | InvoiceBase;
    formType: formTypeEnum;
  };
  InvoiceDetails: { invoiceId: string };
  BusinessSettings: undefined;
  Profile: undefined;
  UserManagement: undefined;
  Settings: undefined;
  SettingsHome: undefined;
  UserForm: { userId?: string; formType: formTypeEnum };
  UserList: undefined;
};
