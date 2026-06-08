export function calcWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0
  return Math.round((correctChars / 5) / (elapsedSeconds / 60))
}

export function calcRawWPM(totalChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0
  return Math.round((totalChars / 5) / (elapsedSeconds / 60))
}

export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

export function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
