import './style/app.css';
import { Provider as ChakraProvider } from '@/components/ui/provider.tsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import AuthProvider from './providers/AuthProvider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/tanstack/queryClient.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

createRoot(document.getElementById('root')!).render(
  <ChakraProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </ChakraProvider>
);
