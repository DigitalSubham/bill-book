import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

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
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={MD3LightTheme}>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
          </PaperProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
};

export default App;
