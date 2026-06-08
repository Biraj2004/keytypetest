import { useRef, useState, useCallback } from 'react'

export function useTimer(onTick: (elapsed: number) => void) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const [elapsed, setElapsed] = useState(0)

  const start = useCallback(() => {
    if (intervalRef.current) return
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const e = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setElapsed(e)
      onTick(e)
    }, 250) // tick every 250ms for smoother updates
  }, [onTick])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setElapsed(0)
  }, [stop])

  return { elapsed, start, stop, reset }
}
