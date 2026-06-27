'use client';

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { store } from '@/store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60 * 5, retry: 2 },
        },
      })
  );

  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            {children}
          </SnackbarProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
