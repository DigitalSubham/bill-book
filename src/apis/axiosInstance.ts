import axios from 'axios';
import { getToken } from '../utils/storage';

const instance = axios.create({
  baseURL: 'https://3nw8jtjy48.execute-api.ap-south-1.amazonaws.com/api', // your API root
});

// 🔥 Add token before every request
instance.interceptors.request.use(async config => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
