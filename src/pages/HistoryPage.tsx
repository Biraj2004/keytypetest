import { PaginatedHistory } from '../components/PaginatedHistory'
import type { ResultRecord } from '../types'
import { usePageMeta } from '../hooks/usePageMeta'

interface Props {
  history: ResultRecord[]
  onClear: () => void
}

export default function HistoryPage({ history, onClear }: Props) {
  usePageMeta({
    title: 'Test History | KeyType',
    description: 'Your recent typing test results — WPM, accuracy, and speed over time. Stored locally on your device.',
    canonical: '/history',
    noIndex: true,
  })

  return (
    <div className="grow flex flex-col justify-between pt-8 pb-4 overflow-hidden animate-fade-in">
      <PaginatedHistory history={history} onClear={onClear} />
    </div>
  )
}
