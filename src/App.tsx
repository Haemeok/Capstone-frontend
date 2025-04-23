import { RouterProvider } from 'react-router';
import router from './router/router';
import { QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import AppProvider from './providers/AppProvider';
import ToastProvider from './providers/ToastProvider';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <RouterProvider router={router} />
        <ToastProvider />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
