import { useRef } from "react"

type Props = {
    delay: number,
    callback: () => void
}

export default function useTimeOut({delay, callback}: Props) {
    const timer = useRef<NodeJS.Timeout | null>(null)

    function startTimeOut() {
        if (timer.current) clearTimeout(timer.current)
        
        timer.current = setTimeout(() => {
            clearTimeout(timer.current)
            timer.current = null
            
            callback()
        }, delay)
    }
    
    return startTimeOut
}