import axios from 'axios';
import { getToken } from '../utils/storage';

const instance = axios.create({
  baseURL: 'http://10.196.73.53:3001/api', // your API root
});

// 🔥 Add token before every request
instance.interceptors.request.use(async config => {
  const token = await getToken();
  console.log('token', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
