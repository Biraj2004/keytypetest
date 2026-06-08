import { X, Share, Plus, MoreVertical } from 'lucide-react'

interface Props {
  onInstall: (() => void) | null   // null = no prompt API (iOS/Safari)
  onClose: () => void
}

// ── Browser detection ─────────────────────────────────────────────────────────
function detectBrowser(): 'ios-safari' | 'chrome' | 'other' {
  const ua = navigator.userAgent
  const isIOS = /iphone|ipad|ipod/i.test(ua)
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
  const isChrome = /chrome|chromium|crios/i.test(ua) && !/edg/i.test(ua)

  if (isIOS || isSafari) return 'ios-safari'
  if (isChrome) return 'chrome'
  return 'other'
}

// ── Step row ──────────────────────────────────────────────────────────────────
function Step({ n, icon, text }: { n: number; icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-sans font-semibold mt-0.5"
        style={{
          fontSize: '0.625rem',
          backgroundColor: 'var(--color-muted-bg)',
          color: 'var(--color-text-tertiary)',
          border: '1px solid var(--color-divider)',
        }}
      >
        {n}
      </span>
      <span
        className="font-sans text-stat-label leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {icon}
        {text}
      </span>
    </li>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function InstallCard({ onInstall, onClose }: Props) {
  const browser = detectBrowser()
  const iconStyle = { color: 'var(--color-accent)' }
  const inlineIcon = 'inline w-3.5 h-3.5 mr-1 -mt-0.5'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(17,17,16,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col gap-5 p-7 rounded-2xl w-full animate-fade-in"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-divider)',
          maxWidth: '420px',
          margin: '0 16px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-opacity duration-150 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
          style={{ color: 'var(--color-text-secondary)', opacity: 0.4 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h2 className="font-sans font-semibold text-logo" style={{ color: 'var(--color-text-primary)' }}>
            install keytype
          </h2>
          <p className="font-sans text-stat-label leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            get the full offline experience — no browser chrome, works without internet after first install.
          </p>
        </div>

        {/* Offline badge — no dot, just text */}
        <div
          className="px-3 py-2 rounded-lg"
          style={{
            backgroundColor: 'rgba(136, 180, 99, 0.08)',
            border: '1px solid rgba(136, 180, 99, 0.2)',
          }}
        >
          <span className="font-sans text-stat-label" style={{ color: 'var(--color-correct)' }}>
            fully offline after install — fonts, words, history all cached
          </span>
        </div>

        {/* ── iOS Safari steps ── */}
        {browser === 'ios-safari' && (
          <div className="flex flex-col gap-3">
            <p className="font-sans text-stat-label" style={{ color: 'var(--color-text-tertiary)' }}>
              on ios safari:
            </p>
            <ol className="flex flex-col gap-2.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <Step n={1} icon={<Share className={inlineIcon} style={iconStyle} />}
                text='tap the share button at the bottom of the screen' />
              <Step n={2} icon={<Plus className={inlineIcon} style={iconStyle} />}
                text='scroll down and tap "add to home screen"' />
              <Step n={3} icon={<span className={`${inlineIcon} font-mono font-semibold`} style={iconStyle}>+</span>}
                text='tap "add" in the top right corner' />
            </ol>
          </div>
        )}

        {/* ── Chrome steps (desktop + Android) ── */}
        {browser === 'chrome' && onInstall && (
          <button
            onClick={onInstall}
            className="w-full py-2.5 rounded-xl font-sans text-mode font-medium cursor-pointer transition-all duration-200 active:scale-95 focus:outline-none"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            install app
          </button>
        )}

        {/* ── Chrome manual fallback (no prompt) ── */}
        {browser === 'chrome' && !onInstall && (
          <div className="flex flex-col gap-3">
            <p className="font-sans text-stat-label" style={{ color: 'var(--color-text-tertiary)' }}>
              on chrome:
            </p>
            <ol className="flex flex-col gap-2.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <Step n={1} icon={<MoreVertical className={inlineIcon} style={iconStyle} />}
                text='click the three-dot menu in the top right' />
              <Step n={2} icon={<Plus className={inlineIcon} style={iconStyle} />}
                text='select "save and share" → "install page as app"' />
              <Step n={3} icon={<span className={`${inlineIcon} font-mono font-semibold`} style={iconStyle}>✓</span>}
                text='click "install" in the confirmation dialog' />
            </ol>
          </div>
        )}

        {/* ── Other browsers ── */}
        {browser === 'other' && onInstall && (
          <button
            onClick={onInstall}
            className="w-full py-2.5 rounded-xl font-sans text-mode font-medium cursor-pointer transition-all duration-200 active:scale-95 focus:outline-none"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            install app
          </button>
        )}

        {browser === 'other' && !onInstall && (
          <p className="font-sans text-stat-label leading-relaxed text-center" style={{ color: 'var(--color-text-tertiary)' }}>
            open in chrome or safari to install
          </p>
        )}

        <p className="font-sans text-hint text-center" style={{ color: 'var(--color-text-tertiary)' }}>
          click anywhere outside to close
        </p>
      </div>
    </div>
  )
}
