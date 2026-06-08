import type { GameState } from '../types'

interface Props {
  state: GameState
}

export function StatsBar({ state }: Props) {
  const { phase, wpm, accuracy, elapsed, timeMode } = state
  const remaining = Math.max(0, timeMode - elapsed)

  return (
    <div
      className={`flex items-end gap-8 font-mono text-secondary text-base select-none transition-opacity duration-200 ease-out ${
        phase === 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-label={`${wpm} words per minute, ${accuracy} percent accuracy, ${remaining} seconds remaining`}
    >
      <div>
        <span className="text-primary text-stat-live font-medium leading-none">
          {wpm}
        </span>
        <span className="ml-1 text-stat-label font-sans text-tertiary lowercase">
          wpm
        </span>
      </div>

      <div>
        <span className="text-primary text-stat-live-sub font-medium leading-none">
          {accuracy}
        </span>
        <span className="ml-1 text-stat-label font-sans text-tertiary">
          %
        </span>
      </div>

      <div className="ml-auto text-stat-live-sub text-primary font-medium leading-none">
        {remaining}s
      </div>
    </div>
  )
}
