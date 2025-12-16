import axios from './axiosInstance';

export const fetchCustomer = () =>
  axios.get('/customers').then(res => res.data);

export const fetchCustomersById = (id: string) =>
  axios.get(`/customers/${id}`).then(res => res.data);

export const createCustomers = (data: any) =>
  axios.post('/customers', data).then(res => res.data);

export const updateCustomers = (id: string, data: any) =>
  axios.put(`/customers/${id}`, data).then(res => res.data);

export const deleteCustomers = (id: string) =>
  axios.delete(`/customers/${id}`).then(res => res.data);
