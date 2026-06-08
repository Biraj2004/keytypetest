import { useState, useEffect } from 'react'
import type { ResultRecord } from '../types'
import { Trash2, ChevronLeft, ChevronRight, AlertTriangle, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  history: ResultRecord[]
  onClear: () => void
}

const PAGE_SIZE = 10

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

// ── Build page number list with ellipsis slots ─────────────────────────────────
// Returns array of page numbers or 'ellipsis' strings
function buildPageItems(total: number, current: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    // Show all pages — no ellipsis needed
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = []
  const addPage = (p: number) => {
    if (!pages.includes(p)) pages.push(p)
  }

  addPage(1)
  if (current > 3) pages.push('ellipsis')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    addPage(p)
  }
  if (current < total - 2) pages.push('ellipsis')
  addPage(total)

  return pages
}

// ── Confirm dialog ─────────────────────────────────────────────────────────────
function ConfirmDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(17,17,16,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onCancel}
    >
      <div
        className="flex flex-col gap-6 p-8 rounded-xl select-none animate-fade-in"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-divider)', minWidth: '320px', maxWidth: '400px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertTriangle className="w-8 h-8" style={{ color: 'var(--color-incorrect)' }} />
          <p className="font-sans text-mode leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            this will permanently delete all{' '}
            <span style={{ color: 'var(--color-text-primary)' }}>test history records</span>.
            this action cannot be undone.
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <button
            onClick={onConfirm}
            className="dialog-btn dialog-btn-danger font-sans text-mode cursor-pointer focus:outline-none"
          >
            clear all
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 select-none animate-fade-in">
      <ClipboardList className="w-10 h-10" style={{ color: 'var(--color-text-tertiary)', opacity: 0.4 }} />
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="font-sans font-medium text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          no tests yet
        </p>
        <p className="font-sans text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          complete a typing test to see your results here
        </p>
      </div>
      <Link
        to="/"
        className="font-sans text-xs transition-colors duration-150"
        style={{ color: 'var(--color-text-secondary)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        ← start typing
      </Link>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function PaginatedHistory({ history, onClear }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)

  const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE))

  // Clamp currentPage when history shrinks (e.g. after partial clears)
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [totalPages, currentPage])

  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const currentItems = history.slice(startIndex, startIndex + PAGE_SIZE)
  const showPagination = totalPages > 1
  const pageItems = buildPageItems(totalPages, safePage)

  const handleClearConfirmed = () => {
    onClear()
    setCurrentPage(1)
    setShowConfirm(false)
  }

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          onConfirm={handleClearConfirmed}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="w-full flex flex-col select-none animate-fade-in" style={{ height: '100%' }}>

        {/* ── Header ── */}
        <div
          className="flex justify-between items-center pb-4 shrink-0"
          style={{ borderBottom: '1px solid var(--color-divider)' }}
        >
          <div className="flex items-baseline gap-3">
            <h1 className="font-sans text-logo font-semibold text-primary">history</h1>
            {history.length > 0 && (
              <span className="font-sans text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {history.length} {history.length === 1 ? 'test' : 'tests'}
                {showPagination && ` · page ${safePage} of ${totalPages}`}
              </span>
            )}
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-danger-ghost inline-flex items-center gap-1.5 font-sans text-stat-label"
              aria-label="Clear all history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>clear all records</span>
            </button>
          )}
        </div>

        {/* ── Content ── */}
        {history.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>

            {/* Scrollable table area */}
            <div className="overflow-y-auto overflow-x-auto" style={{ flex: 1, scrollbarWidth: 'none' }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['wpm', 'raw', 'acc', 'duration', 'difficulty', 'when'].map(col => (
                      <th
                        key={col}
                        className="py-2.5 font-sans font-normal lowercase text-center sticky top-0"
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--color-text-secondary)',
                          borderBottom: '1px solid var(--color-divider)',
                          background: 'var(--color-bg)',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((record, index) => (
                    <tr
                      key={`${safePage}-${index}`}
                      className="transition-colors duration-150"
                      style={{ borderBottom: '1px solid var(--color-divider)' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td className="py-2 font-mono font-medium text-center" style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                        {record.wpm}
                      </td>
                      <td className="py-2 font-mono text-center text-mode" style={{ color: 'var(--color-text-secondary)' }}>
                        {record.rawWpm}
                      </td>
                      <td className="py-2 font-mono text-center text-mode" style={{ color: 'var(--color-text-secondary)' }}>
                        {record.accuracy}%
                      </td>
                      <td className="py-2 font-sans text-center text-mode lowercase" style={{ color: 'var(--color-text-secondary)' }}>
                        {record.timeMode}s
                      </td>
                      <td className="py-2 font-sans text-center text-mode lowercase" style={{ color: 'var(--color-text-secondary)' }}>
                        {record.difficultyMode}
                      </td>
                      <td className="py-2 font-sans text-center text-mode" style={{ color: 'var(--color-text-tertiary)' }}>
                        {formatRelativeTime(record.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {showPagination && (
              <nav
                role="navigation"
                aria-label="History pagination"
                className="flex justify-center items-center gap-1 font-sans text-mode py-3 shrink-0"
                style={{ borderTop: '1px solid var(--color-divider)' }}
              >
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className="p-1.5 rounded cursor-pointer transition-colors duration-100 focus:outline-none disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => { if (safePage !== 1) e.currentTarget.style.color = 'var(--color-text-primary)' }}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page items */}
                {pageItems.map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-1 text-xs select-none"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      aria-label={`Page ${item}`}
                      aria-current={item === safePage ? 'page' : undefined}
                      className="min-w-8 h-8 px-2 rounded cursor-pointer transition-colors duration-100 focus:outline-none text-sm"
                      style={{
                        color: item === safePage ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        fontWeight: item === safePage ? 500 : 400,
                      }}
                      onMouseEnter={e => { if (item !== safePage) e.currentTarget.style.color = 'var(--color-text-primary)' }}
                      onMouseLeave={e => { if (item !== safePage) e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                    >
                      {item}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                  className="p-1.5 rounded cursor-pointer transition-colors duration-100 focus:outline-none disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={e => { if (safePage !== totalPages) e.currentTarget.style.color = 'var(--color-text-primary)' }}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        )}
      </div>
    </>
  )
}
