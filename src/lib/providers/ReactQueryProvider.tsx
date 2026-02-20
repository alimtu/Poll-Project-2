'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 10, // 10 min — data considered fresh
            gcTime: 1000 * 60 * 15, // 15 min — inactive cache kept in memory
            retry: 2, // retry failed queries twice
            retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10_000), // exponential backoff
            refetchOnWindowFocus: true, // refetch stale data when tab regains focus
            refetchOnReconnect: true, // refetch when network reconnects
            refetchOnMount: true, // refetch stale data on component mount
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
