import { useRef } from "react"

type Props = {
    delay: number,
    callback: () => void
}

export default function useTimeout({delay, callback}: Props) {
    const timer = useRef<NodeJS.Timeout | null>(null)

    function clearTimer() {
        if (timer.current) {
            clearTimeout(timer.current)
            timer.current = null
        }
    }

    function startTimeout() {
        if (timer.current) clearTimer()
        
        timer.current = setTimeout(() => {
            clearTimer()           
            callback()
        }, delay)
    }
    
    return {startTimeout, clearTimer}
}