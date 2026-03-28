import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loginEmailApi,
  registerApi,
  sendOtpApi,
  verifyOtpApi,
} from '../apis/authApi';
import { useAuthContext } from '../context/AuthContext';

export const useSendOtp = () =>
  useMutation({
    mutationFn: (mobile: string) => sendOtpApi(mobile),
  });

export const useVerifyOtp = () => {
  const { setAuthToken } = useAuthContext();

  return useMutation({
    mutationFn: ({ mobile, otp }: any) => verifyOtpApi(mobile, otp),
    onSuccess: async res => {
      const token = res.data.token;
      await setAuthToken(token);
    },
  });
};

export const useLoginEmail = () => {
  const { setAuthToken } = useAuthContext();

  return useMutation({
    mutationFn: ({ email, password }: any) => loginEmailApi(email, password),
    onSuccess: async res => {
      const token = res.data.token;
      await setAuthToken(token);
    },
  });
};

export const useRegister = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      registerApi(email, password),
  });

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuthToken } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      await clearAuthToken();
      queryClient.clear();
    },
  });
};
