'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export function ReactQueryProvider({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Only in development */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
