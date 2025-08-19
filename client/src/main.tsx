import './style/app.css';
import { Provider as ChakraProvider } from '@/components/ui/provider.tsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import AuthProvider from './providers/AuthProvider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/tanstack/queryClient.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ModalProvider from './providers/ModalProvider.tsx';
import SearchProvider from './providers/SearchProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <ChakraProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalProvider>
          <SearchProvider>
            <RouterProvider router={router} />
          </SearchProvider>
        </ModalProvider>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </ChakraProvider>
);
