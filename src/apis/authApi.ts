import axios from './axiosInstance';

export const sendOtpApi = (mobile: string) =>
  axios.post(`/auth/send-otp`, { mobile });

export const verifyOtpApi = (mobile: string, otp: string) =>
  axios.post(`/auth/verify-otp`, { mobile, otp });

export const loginEmailApi = async (email: string, password: string) =>
  axios.post(`/auth/login`, { email, password });

export const registerApi = (email?: string, password?: string) =>
  axios.post(`/auth/register`, {
    email,
    password,
  });

export const updateProfileApi = (data: any) => {
  return axios.put(`/auth/profile`, data);
};

export const getProfileApi = () =>
  axios.get(`/auth/profile`).then(res => res.data);
