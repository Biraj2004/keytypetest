import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useTypingEngine } from './hooks/useTypingEngine'
import { useResultsHistory } from './lib/storage'
import { HiddenInput } from './components/HiddenInput'
import { WordDisplay } from './components/WordDisplay'
import { StatsBar } from './components/StatsBar'
import { ResultsModal } from './components/ResultsModal'
import { Header } from './components/Header'
import { HistoryList } from './components/HistoryList'
import { InstallCard } from './components/InstallCard'
import { ErrorBoundary } from './components/ErrorBoundary'
import HistoryPage from './pages/HistoryPage'
import GuidePage from './pages/GuidePage'
import NotFound from './pages/NotFound'
import type { BeforeInstallPromptEvent } from './types'
import { RotateCcw, Download } from 'lucide-react'
import { usePageMeta } from './hooks/usePageMeta'

// ── Home page content with its own meta ──────────────────────────────────────
interface HomePageProps {
  state: ReturnType<typeof import('./hooks/useTypingEngine').useTypingEngine>['state']
  onInput: ReturnType<typeof import('./hooks/useTypingEngine').useTypingEngine>['onInput']
  onKeyDown: ReturnType<typeof import('./hooks/useTypingEngine').useTypingEngine>['onKeyDown']
  restart: () => void
  history: import('./types').ResultRecord[]
  showInstall: boolean
  onInstallClick: () => void
}

function HomePage({ state, onInput, onKeyDown, restart, history, showInstall, onInstallClick }: HomePageProps) {
  usePageMeta({
    title: 'KeyType — Free Online Typing Speed Test | WPM Practice',
    description: 'Free online typing speed test — measure your WPM and accuracy in 15, 30, 60, or 120 second tests. No signup required. Works offline. Start typing now.',
    canonical: '/',
  })

  return (
    <>
      <h1 className="sr-only">KeyType — Free Online Typing Speed Test</h1>

      <div className="grow flex flex-col justify-center gap-6 md:gap-8 my-auto">
        <main className="flex flex-col gap-6 md:gap-8">
          <StatsBar state={state} />

          <div className="relative w-full">
            <HiddenInput
              value={state.currentInput}
              onChange={onInput}
              onKeyDown={(e) => onKeyDown(e.nativeEvent)}
              disabled={state.phase === 'results'}
            />
            <WordDisplay
              words={state.words}
              currentInput={state.currentInput}
              wordIndex={state.wordIndex}
              phase={state.phase}
              typedWords={state.typedWords}
            />
          </div>

          {/* Restart button */}
          <div className={`flex justify-center mt-2 transition-opacity duration-300 ${state.phase === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button
              onClick={restart}
              className="group p-2.5 rounded-full text-tertiary hover:text-primary transition-all duration-200 cursor-pointer active:scale-90 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Restart typing test"
              tabIndex={-1}
            >
              <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-300 ease-out" />
            </button>
          </div>
        </main>

        <footer className={`font-sans text-stat-label text-center select-none flex flex-col items-center gap-4 transition-opacity duration-300 ${state.phase === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex justify-center items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
            <span>tab — restart test</span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>·</span>
            <span>esc — cancel</span>
          </div>
          {showInstall && (
            <button
              onClick={onInstallClick}
              className="inline-flex items-center gap-1.5 font-sans cursor-pointer transition-colors duration-200 active:scale-95 bg-transparent border-none p-0 focus:outline-none select-none"
              style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              aria-label="Install KeyType app"
            >
              <Download className="w-3 h-3" />
              <span>install app</span>
            </button>
          )}
        </footer>
      </div>

      {/* Bottom slot: recent history preview */}
      <div className="h-25 flex flex-col justify-end">
        {state.phase === 'idle' && (
          <HistoryList history={history} limit={2} />
        )}
      </div>
    </>
  )
}

// ── App Shell (layout + global state) ────────────────────────────────────────
function AppShell() {
  const { state, onInput, onKeyDown, restart, setTimeMode, setDifficultyMode } = useTypingEngine()
  const { history, append, clear } = useResultsHistory()
  const prevPhaseRef = useRef(state.phase)
  const location = useLocation()
  const navigate = useNavigate()

  const isTestView = location.pathname === '/'
  const isHistoryView = location.pathname === '/history'
  const isGuideView = location.pathname === '/guide'
  const is404View = !isTestView && !isHistoryView && !isGuideView

  // PWA & Network Offline Handling state
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallCard, setShowInstallCard] = useState(false)

  // Detect iOS (no beforeinstallprompt — needs manual steps)
  const isIOSDevice = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const canShowInstall = !!installPrompt || isIOSDevice

  // Map location to the header view tabs
  const currentView: 'test' | 'history' | 'guide' = isGuideView ? 'guide' : isHistoryView ? 'history' : is404View ? 'guide' : 'test'
  const handleViewChange = (view: 'test' | 'history' | 'guide') => {
    if (view === 'history') navigate('/history')
    else if (view === 'guide') navigate('/guide')
    else navigate('/')
  }

  // Listen to network changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Listen to beforeinstallprompt for PWA install button availability
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) {
      setShowInstallCard(true)
      return
    }
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
      setShowInstallCard(false)
    }
  }

  // Listen to phase changes and persist finished test details
  useEffect(() => {
    if (prevPhaseRef.current === 'running' && state.phase === 'results') {
      append({
        wpm: state.wpm,
        rawWpm: state.rawWpm,
        accuracy: state.accuracy,
        timeMode: state.timeMode,
        difficultyMode: state.difficultyMode,
        timestamp: Date.now(),
      })
    }
    prevPhaseRef.current = state.phase
  }, [
    state.phase,
    state.wpm,
    state.rawWpm,
    state.accuracy,
    state.timeMode,
    state.difficultyMode,
    append,
  ])

  // Global keyboard shortcuts (only on test view)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isTestView) {
        onKeyDown(e)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [onKeyDown, isTestView])

  return (
    <>
      {/* Install Card Modal */}
      {showInstallCard && (
        <InstallCard
          onInstall={installPrompt ? handleInstall : null}
          onClose={() => setShowInstallCard(false)}
        />
      )}

      {/* Mobile Screen Warning — portrait and landscape small screens */}
      {/* Guide page is accessible on mobile, test/history are not */}
      {!isGuideView && (
        <>
          {/* Portrait: width < 480px */}
          <div className="hidden max-xs:flex flex-col justify-center items-center h-screen text-center px-8 bg-bg select-none gap-5">
            <span className="font-sans font-semibold text-xl text-primary tracking-tight">keytype</span>
            <p className="text-secondary text-sm font-sans leading-relaxed" style={{ maxWidth: '260px' }}>
              KeyType requires a physical keyboard. Open on a desktop or laptop to start typing.
            </p>
            <a
              href="/guide"
              className="font-sans text-sm transition-colors duration-150"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              read the guide →
            </a>
          </div>

          {/* Landscape mobile: height < 480px, orientation landscape */}
          <div
            id="landscape-warning"
            style={{ display: 'none' }}
          />
        </>
      )}

      {/* Landscape warning via CSS — avoids JS resize listeners */}
      <style>{`
        @media (max-height: 480px) and (orientation: landscape) {
          #landscape-warning {
            display: flex !important;
            position: fixed;
            inset: 0;
            z-index: 9999;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            background: var(--color-bg);
            padding: 32px;
            text-align: center;
          }
          #landscape-warning::before {
            content: 'keytype';
            font-family: var(--font-sans);
            font-weight: 600;
            font-size: 1.125rem;
            color: var(--color-text-primary);
          }
          #landscape-warning::after {
            content: 'KeyType requires a physical keyboard. Open on a desktop or laptop to start typing.';
            font-family: var(--font-sans);
            font-size: 0.8125rem;
            color: var(--color-text-secondary);
            line-height: 1.6;
            max-width: 340px;
          }
        }
      `}</style>

      {/* Main Container — hidden on small screens UNLESS on guide page */}
      <div className={`${isGuideView ? '' : 'max-xs:hidden'} max-w-container mx-auto px-4 sm:px-8 md:px-12 ${isGuideView ? 'min-h-dvh' : 'h-dvh overflow-hidden'} py-8 flex flex-col justify-between select-none relative`}>

        {/* Header — hidden while typing */}
        <div className={`transition-opacity duration-300 ${state.phase === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Header
            currentMode={state.timeMode}
            onModeChange={setTimeMode}
            currentDifficulty={state.difficultyMode}
            onDifficultyChange={setDifficultyMode}
            isOffline={isOffline}
            currentView={currentView}
            onViewChange={handleViewChange}
          />
        </div>

        {/* Route Content */}
        <Routes>
          {/* Test page */}
          <Route
            path="/"
            element={
              <HomePage
                state={state}
                onInput={onInput}
                onKeyDown={onKeyDown}
                restart={restart}
                history={history}
                showInstall={canShowInstall}
                onInstallClick={() => setShowInstallCard(true)}
              />
            }
          />

          {/* History page */}
          <Route
            path="/history"
            element={<HistoryPage history={history} onClear={clear} />}
          />

          {/* Guide / FAQ page */}
          <Route
            path="/guide"
            element={<GuidePage />}
          />

          {/* 404 — catches any unknown path */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ResultsModal state={state} onRestart={restart} />
      </div>
    </>
  )
}

// ── Root (Error Boundary wraps everything) ────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  )
}
