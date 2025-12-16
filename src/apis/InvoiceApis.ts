import axios from './axiosInstance';

export const fetchCustomer = () => axios.get('/invoices').then(res => res.data);

export const fetchInvoices = () => axios.get(`/invoices`).then(res => res.data);

export const fetchInvoicesById = (id: string) =>
  axios.get(`/invoices/${id}`).then(res => res.data);

export const createInvoices = (data: any) =>
  axios.post('/invoices', data).then(res => res.data);

export const deleteInvoices = (id: string) =>
  axios.delete(`/invoices/${id}`).then(res => res.data);
