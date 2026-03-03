import axios from 'axios';
import { getToken } from '../utils/storage';
import config from '../config';

const instance = axios.create({
  baseURL: config.base_url.BASE_URL,
});

// 🔥 Add token before every request
instance.interceptors.request.use(async config => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject({
      message:
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        'Something went wrong',
      status: error?.response?.status,
      raw: error,
    });
  },
);

export default instance;
