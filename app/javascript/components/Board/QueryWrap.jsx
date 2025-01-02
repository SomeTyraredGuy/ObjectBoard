import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Index from './Index'
import { CACHE_TIME } from '../../Data/constants.js'

function QueryWrap({db}) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          cacheTime: CACHE_TIME,
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