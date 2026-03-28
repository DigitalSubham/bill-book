import { createNavigationContainerRef, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { useAuthContext } from '../context/AuthContext';
import SplashScreen from '../components/common/SplashScreen';

export const navigationRef = createNavigationContainerRef<any>();

const AppNavigator = () => {
  const { token, loading } = useAuthContext();

  if (loading) return <SplashScreen />;

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      {token ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
