import axios from './axiosInstance';

const API_URL = 'http://10.196.73.53:3001/api/auth';

export const sendOtpApi = (mobile: string) =>
  axios.post(`${API_URL}/send-otp`, { mobile });

export const verifyOtpApi = (mobile: string, otp: string) =>
  axios.post(`${API_URL}/verify-otp`, { mobile, otp });

export const loginEmailApi = async (email: string, password: string) =>
  axios.post(`${API_URL}/login`, { email, password });

export const registerApi = (email?: string, password?: string) =>
  axios.post(`${API_URL}/register`, {
    email,
    password,
  });

export const updateProfileApi = (data: any) =>
  axios.put(`${API_URL}/profile`, data);

export const getProfileApi = () =>
  axios.get(`${API_URL}/profile`).then(res => res.data);
