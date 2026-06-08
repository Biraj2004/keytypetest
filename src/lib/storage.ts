import { useState, useCallback } from 'react'
import type { ResultRecord } from '../types'

const STORAGE_KEY = 'keytype-results-history'
const MAX_HISTORY_LEN = 45

export function getResultsHistory(): ResultRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed)) {
      return parsed as ResultRecord[]
    }
    return []
  } catch (err) {
    // Log nothing identifying, continue without crashing
    console.error('Failed to read results history:', err)
    return []
  }
}

export function saveResultsHistory(history: ResultRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (err) {
    // Log nothing identifying, continue without crashing
    console.error('Failed to save results history:', err)
  }
}

export function clearResultsHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('Failed to clear results history:', err)
  }
}

export function useResultsHistory() {
  const [history, setHistory] = useState<ResultRecord[]>(() => getResultsHistory())

  const append = useCallback((result: ResultRecord) => {
    setHistory((prev) => {
      const next = [result, ...prev]
      if (next.length > MAX_HISTORY_LEN) {
        next.splice(MAX_HISTORY_LEN) // FIFO cap at 50 most recent records
      }
      saveResultsHistory(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setHistory([])
    clearResultsHistory()
  }, [])

  return { history, append, clear }
}
