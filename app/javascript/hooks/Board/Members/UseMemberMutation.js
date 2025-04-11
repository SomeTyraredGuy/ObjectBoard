import { BASE_BOARD_URL, getCSRFToken } from '../../../Data/constants.js'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'


export default function UseMemberMutation({path, board_id, refetchFn, defaultValue, method}) {
    const [value, setValue] = useState(defaultValue)

    const {
        mutate,
        error,
        isError,
        isSuccess
      } = useMutation({
        mutationFn: async () => {
          const response = await fetch(`${BASE_BOARD_URL}${board_id}/member/${path}`, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-CSRF-Token': getCSRFToken(),
            },
            body: JSON.stringify({value})
          })
    
          if (!response.ok) {
            const errorData = await response.json()
            
            if (errorData.error) throw new Error(errorData.error)
            throw new Error()
          }
        },
        onSuccess: refetchFn
    })

    return{
        mutate,
        error,
        isError,
        isSuccess,
        value,
        setValue
    }
}
