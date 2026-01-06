import Toast from 'react-native-toast-message';

export const successToast = (title: string, message?: string) =>
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
  });

export const errorToast = (title: string, message?: string) =>
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
  });

export const infoToast = (title: string, message?: string) =>
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
  });
