import axios from './axiosInstance';
import { fetchPaginatedList } from './pagination';
import { PaginationParams, ProductType } from '../types';

export const fetchProducts = () => axios.get('/products').then(res => res.data);

export const fetchProductsPage = (params?: PaginationParams) =>
  fetchPaginatedList<ProductType>('/products', params);

export const fetchProductById = (id: string) =>
  axios.get(`/products/${id}`).then(res => res.data);

export const createProduct = (data: any) =>
  axios.post('/products', data).then(res => res.data);

export const updateProduct = (id: string, data: any) =>
  axios.put(`/products/${id}`, data).then(res => res.data);

export const deleteProduct = (id: string) =>
  axios.delete(`/products/${id}`).then(res => res.data);
