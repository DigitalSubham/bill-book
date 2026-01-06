import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeToken, saveToken } from '../utils/storage';
import {
  loginEmailApi,
  registerApi,
  sendOtpApi,
  verifyOtpApi,
} from '../apis/authApi';
import { logout, setToken } from '../redux/slices/authSlice';
import { useAppDispatch } from '../redux/hooks';
const queryClient = useQueryClient();

export const useSendOtp = () =>
  useMutation({
    mutationFn: (mobile: string) => sendOtpApi(mobile),
  });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: ({ mobile, otp }: any) => verifyOtpApi(mobile, otp),
    onSuccess: async res => {
      const token = res.data.token;
      await saveToken(token);
    },
  });

export const useLoginEmail = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: ({ email, password }: any) => loginEmailApi(email, password),
    onSuccess: async res => {
      const token = res.data.token;
      await saveToken(token);
      dispatch(setToken(token));
    },
  });
};

export const useRegister = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      registerApi(email, password),
  });

export const useLogout = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async () => {
      await removeToken();
      queryClient.clear();
      dispatch(logout());
    },
  });
};
