import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta({
    title: '404 — Page Not Found | KeyType',
    description: 'This page does not exist. Head back to the KeyType typing test.',
    canonical: '/404',
    noIndex: true,
  })
  return (
    <div className="h-dvh flex flex-col items-center justify-center select-none px-8">
      {/* Large 404 */}
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        <div className="flex items-end gap-4">
          <span
            className="font-mono font-medium leading-none"
            style={{ fontSize: '9rem', color: 'var(--color-text-tertiary)', lineHeight: 1 }}
          >
            4
          </span>
          <span
            className="font-mono font-medium leading-none"
            style={{ fontSize: '9rem', color: 'var(--color-accent)', lineHeight: 1 }}
          >
            0
          </span>
          <span
            className="font-mono font-medium leading-none"
            style={{ fontSize: '9rem', color: 'var(--color-text-tertiary)', lineHeight: 1 }}
          >
            4
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p
            className="font-sans font-medium text-logo"
            style={{ color: 'var(--color-text-primary)' }}
          >
            page not found
          </p>
          <p
            className="font-sans text-mode max-w-xs leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            the url you typed doesn't exist. maybe it was a typo — fitting for a typing app.
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 font-sans text-mode transition-all duration-200 active:scale-95"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)'
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>go home</span>
        </Link>
      </div>
    </div>
  )
}
