import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Index from './Index'

function QueryWrap({db}) {
    const queryClient = new QueryClient()

    return (
    <QueryClientProvider client={queryClient}>
        <Index db={db}/>
    </QueryClientProvider>
  )
}

export default QueryWrap