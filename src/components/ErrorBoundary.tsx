import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('KeyType caught a runtime error:', error, info.componentStack)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-dvh flex flex-col items-center justify-center select-none px-8">
          <div className="flex flex-col items-center gap-8 animate-fade-in" style={{ maxWidth: '480px' }}>

            {/* Icon + code */}
            <div className="flex flex-col items-center gap-3">
              <AlertTriangle
                className="w-12 h-12"
                style={{ color: 'var(--color-incorrect)' }}
              />
              <span
                className="font-mono text-hint uppercase tracking-widest"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                error 500
              </span>
            </div>

            {/* Message */}
            <div className="flex flex-col items-center gap-2 text-center">
              <p
                className="font-sans font-medium text-logo"
                style={{ color: 'var(--color-text-primary)' }}
              >
                something went wrong
              </p>
              <p
                className="font-sans text-mode leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                an unexpected error crashed the app. your history is safe in local storage.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-1.5 font-sans text-mode cursor-pointer transition-all duration-200 active:scale-95 bg-transparent border-none p-0 focus:outline-none"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
              >
                try again
              </button>
              <button
                onClick={this.handleReload}
                className="flex items-center gap-1.5 font-sans text-mode cursor-pointer transition-all duration-200 active:scale-95 bg-transparent border-none p-0 focus:outline-none"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>reload page</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
