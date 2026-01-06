import axios from './axiosInstance';
export const dashboardStats = () =>
  axios.get('/general/').then(res => res.data);
