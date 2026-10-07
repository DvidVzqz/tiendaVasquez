import { createRoot } from 'react-dom/client'
import './index.css'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from 'react-router-dom';
import router from './router.tsx';
import { LoadingProvider } from './contexts/LoadingContext.tsx';
import { ProductProvider } from './contexts/ProductContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <LoadingProvider>
      <ProductProvider>
        <RouterProvider router={router} />
      </ProductProvider>
    </LoadingProvider>
  </QueryClientProvider>
)
