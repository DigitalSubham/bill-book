import axios from 'axios';
import { getToken } from '../utils/storage';

const baseURLLive =
  'https://3nw8jtjy48.execute-api.ap-south-1.amazonaws.com/api/';
const baseURLLocal = 'http://10.156.80.53:3001/api/';

const instance = axios.create({
  baseURL: baseURLLive,
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
