'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 2 minutes — cached data is shown
            // instantly on revisit and only refetched after it goes stale.
            staleTime: 2 * 60 * 1000,
            // Keep unused cache for 15 minutes so navigating away and back
            // still hits the cache instead of an empty loading state.
            gcTime: 15 * 60 * 1000,
            // Slow/unstable network: don't refire every query on tab focus;
            // staleTime already governs refetch frequency.
            refetchOnWindowFocus: false,
            retry: 1,
        }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
