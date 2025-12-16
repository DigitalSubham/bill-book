import { createNavigationContainerRef, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { useEffect } from 'react';
import { loadToken } from '../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export const navigationRef = createNavigationContainerRef<any>();

const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { token, loading } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
  }, []);

  if (loading) return null; // splash screen recommended

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
    },
  };

  console.log("token", token)

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      {token ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
