import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';

LogBox.ignoreAllLogs();

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute default
    },
  },
});

const App = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PaperProvider theme={MD3LightTheme}>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
            <Toast />
          </PaperProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
