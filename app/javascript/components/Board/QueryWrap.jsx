import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Index from './Index'

function QueryWrap({db}) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          cacheTime: 5000, // 5 seconds
        },
      }
    })

    return (
    <QueryClientProvider client={queryClient}>
        <Index db={db}/>
    </QueryClientProvider>
  )
}

export default QueryWrap