import type { TimeMode, DifficultyMode } from '../types'

const MODES: TimeMode[] = [15, 30, 60, 120]
const DIFFICULTIES: DifficultyMode[] = ['easy', 'difficult']

interface Props {
  currentMode: TimeMode
  onModeChange: (mode: TimeMode) => void
  currentDifficulty: DifficultyMode
  onDifficultyChange: (difficulty: DifficultyMode) => void
  isOffline?: boolean
  currentView: 'test' | 'history' | 'guide'
  onViewChange: (view: 'test' | 'history' | 'guide') => void
  showSelectors?: boolean
}

export function Header({
  currentMode,
  onModeChange,
  currentDifficulty,
  onDifficultyChange,
  isOffline = false,
  currentView,
  onViewChange,
  showSelectors = true,
}: Props) {
  const tabButtonClass =
    "px-3 py-1 rounded-full text-stat-label text-secondary hover:text-primary transition-all duration-200 ease-out aria-selected:text-accent cursor-pointer active:scale-95 select-none font-medium"

  const pillButtonClass =
    "px-2 py-0.5 rounded-full text-stat-label text-secondary hover:text-primary transition-all duration-200 ease-out aria-selected:text-accent cursor-pointer active:scale-95 select-none"

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full select-none">
      {/* Left section: Logo, Offline Badge, and View Navigation Tab Group */}
      <div className="flex items-center gap-4">
        <span className="font-sans font-semibold text-logo text-primary tracking-tight hover:text-accent transition-colors duration-200 cursor-pointer">
          keytype
        </span>

        {isOffline && (
          <span className="font-sans text-[9px] text-incorrect border border-incorrect/35 px-1.5 py-0.5 rounded-full select-none uppercase tracking-wider font-semibold animate-pulse">
            offline
          </span>
        )}

        <nav
          role="tablist"
          aria-label="Navigation views"
          className="flex items-center gap-1 bg-surface/50 border border-divider/10 px-2.5 py-1 rounded-full backdrop-blur-sm"
        >
          <button
            role="tab"
            aria-selected={currentView === 'test'}
            onClick={() => onViewChange('test')}
            className={tabButtonClass}
          >
            test
          </button>
          <button
            role="tab"
            aria-selected={currentView === 'history'}
            onClick={() => onViewChange('history')}
            className={tabButtonClass}
          >
            history
          </button>
          <button
            role="tab"
            aria-selected={currentView === 'guide'}
            onClick={() => onViewChange('guide')}
            className={tabButtonClass}
          >
            guide
          </button>
        </nav>
      </div>

      {/* Right section: selectors */}
      <div className="flex items-center gap-3">        {/* Difficulty and Timer selectors (Only shown in 'test' view) */}
        {currentView === 'test' && showSelectors && (
          <div className="flex items-center gap-3.5 bg-surface/50 border border-divider/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {/* Difficulty Group */}
            <div className="flex items-center gap-1.5">
              <span className="hidden lg:block text-[9px] text-tertiary font-sans font-semibold uppercase tracking-wider select-none">
                difficulty
              </span>
              <div className="flex items-center gap-0.5">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    role="tab"
                    aria-selected={currentDifficulty === diff}
                    onClick={() => onDifficultyChange(diff)}
                    className={pillButtonClass}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-divider/40 select-none text-xs">|</span>

            {/* Time Group */}
            <div className="flex items-center gap-1.5">
              <span className="hidden lg:block text-[9px] text-tertiary font-sans font-semibold uppercase tracking-wider select-none">
                time
              </span>
              <div className="flex items-center gap-0.5">
                {MODES.map((mode) => (
                  <button
                    key={mode}
                    role="tab"
                    aria-selected={currentMode === mode}
                    onClick={() => onModeChange(mode)}
                    className={pillButtonClass}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
