import { useEffect, useRef, useState } from 'react'
import type { GameState } from '../types'
import { RotateCcw } from 'lucide-react'

interface Props {
  state: GameState
  onRestart: () => void
}

const AUTO_CLOSE_MS = 5000
const TICK_MS = 50 // update interval for smooth progress

export function ResultsModal({ state, onRestart }: Props) {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset and start timer whenever results phase begins
  useEffect(() => {
    if (state.phase !== 'results') {
      setElapsed(0)
      return
    }

    setElapsed(0)

    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + TICK_MS
        if (next >= AUTO_CLOSE_MS) {
          clearInterval(intervalRef.current!)
          onRestart()
          return AUTO_CLOSE_MS
        }
        return next
      })
    }, TICK_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase])

  if (state.phase !== 'results') return null

  const progress = Math.min(elapsed / AUTO_CLOSE_MS, 1) // 0 → 1
  const secondsLeft = Math.ceil((AUTO_CLOSE_MS - elapsed) / 1000)

  const secondaryStats = [
    { label: 'raw',  value: String(state.rawWpm) },
    { label: 'acc',  value: `${state.accuracy}%` },
    { label: 'time', value: `${state.timeMode}s` },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Test results"
      className="fixed inset-0 flex flex-col items-center justify-center select-none animate-fade-in"
      style={{ background: 'var(--color-overlay)' }}
    >
      <div className="flex flex-col items-center gap-8">

        {/* ── Primary stat */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="font-mono font-medium leading-none"
            style={{ fontSize: '5rem', color: 'var(--color-text-primary)', lineHeight: 1 }}
            aria-label={`${state.wpm} words per minute`}
          >
            {state.wpm}
          </span>
          <span
            className="font-sans uppercase tracking-widest"
            style={{ fontSize: '0.625rem', color: 'var(--color-text-tertiary)', letterSpacing: '0.18em' }}
          >
            wpm
          </span>
        </div>

        {/* ── Divider */}
        <div className="w-16" style={{ height: '1px', background: 'var(--color-divider)' }} />

        {/* ── Secondary stats */}
        <div className="flex items-start gap-10">
          {secondaryStats.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <span
                className="font-sans uppercase tracking-widest"
                style={{ fontSize: '0.625rem', color: 'var(--color-text-tertiary)', letterSpacing: '0.14em' }}
              >
                {label}
              </span>
              <span
                className="font-mono font-medium"
                style={{ fontSize: '1.75rem', color: 'var(--color-text-primary)', lineHeight: 1 }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Restart hint + auto-close progress */}
        <div className="flex flex-col items-center gap-2 mt-2">

          {/* Restart button */}
          <button
            onClick={onRestart}
            className="group inline-flex items-center gap-2 font-sans cursor-pointer bg-transparent border-none p-0 focus:outline-none rounded px-2 py-1 active:scale-95 transition-all duration-200"
            style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            aria-label="Restart typing test"
          >
            <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-300 ease-out" />
            <span>tab — restart test</span>
          </button>

          {/* Auto-close progress bar + countdown */}
          <div className="flex flex-col items-center gap-1.5">
            {/* Track */}
            <div
              className="rounded-full overflow-hidden"
              style={{ width: '6rem', height: '2px', background: 'var(--color-divider)' }}
            >
              {/* Fill — drains left to right */}
              <div
                style={{
                  height: '100%',
                  width: `${(1 - progress) * 100}%`,
                  background: 'var(--color-text-secondary)',
                  transition: `width ${TICK_MS}ms linear`,
                  transformOrigin: 'left',
                }}
              />
            </div>

            {/* Countdown label */}
            <span
              className="font-sans"
              style={{ fontSize: '0.5625rem', color: 'var(--color-text-secondary)', letterSpacing: '0.06em' }}
            >
              restarting in {secondsLeft}s
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}
