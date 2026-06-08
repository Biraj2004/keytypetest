import type { ResultRecord } from '../types'

interface Props {
  history: ResultRecord[]
  limit?: number
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const secs = Math.floor(diff / 1000)
  if (secs < 1) return 'just now'
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function HistoryList({ history, limit = 2 }: Props) {
  const displayHistory = history.slice(0, limit)

  if (displayHistory.length === 0) return null

  return (
    <div
      className="w-full font-sans select-none"
      style={{ borderTop: '1px solid var(--color-divider)', paddingTop: '10px' }}
    >
      {/* Section label — intentionally dim */}
      <span
        className="block mb-2 uppercase"
        style={{ fontSize: '0.5625rem', color: 'var(--color-text-tertiary)', letterSpacing: '0.16em' }}
      >
        recent
      </span>

      {/* Rows */}
      <div className="flex flex-col gap-1.5">
        {displayHistory.map((record, index) => (
          <div key={index} className="flex items-center justify-between gap-4">

            {/* Left: WPM */}
            <div className="flex items-baseline gap-1 shrink-0" style={{ minWidth: '3.5rem' }}>
              <span
                className="font-mono font-medium"
                style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)', lineHeight: 1 }}
              >
                {record.wpm}
              </span>
              <span
                className="font-sans"
                style={{ fontSize: '0.625rem', color: 'var(--color-text-secondary)' }}
              >
                wpm
              </span>
            </div>

            {/* Middle: secondary stats */}
            <div
              className="flex items-center gap-2.5 grow"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}
            >
              <span>{record.rawWpm} raw</span>
              <span style={{ color: 'var(--color-text-tertiary)' }}>·</span>
              <span>{record.accuracy}%</span>
              <span style={{ color: 'var(--color-text-tertiary)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-sans)' }}>{record.timeMode}s · {record.difficultyMode}</span>
            </div>

            {/* Right: time ago */}
            <span
              className="shrink-0 font-sans"
              style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}
            >
              {formatRelativeTime(record.timestamp)}
            </span>

          </div>
        ))}
      </div>
    </div>
  )
}
