import { useEffect, useRef, useState } from 'react'

interface Props {
  words: string[]
  currentInput: string
  wordIndex: number
  phase: 'idle' | 'running' | 'results'
  typedWords: string[][]
}

export function WordDisplay({ words, currentInput, wordIndex, phase, typedWords }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeWordRef = useRef<HTMLSpanElement>(null)
  const [translateY, setTranslateY] = useState(0)

  // Responsive line-scrolling mechanism
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const activeWordEl = activeWordRef.current
      const wordOffsetTop = activeWordEl.offsetTop
      const lineHeight = activeWordEl.offsetHeight

      // Calculate current visual line (0-indexed)
      const currentLine = Math.round(wordOffsetTop / lineHeight)

      // When cursor advances past row 1, shift all rows upward
      if (currentLine >= 2) {
        setTranslateY(-(currentLine - 1) * lineHeight)
      } else {
        setTranslateY(0)
      }
    }
  }, [wordIndex])


  return (
    <div className="relative w-full word-display-container" ref={containerRef}>
      <div
        className="w-full flex flex-wrap word-display-content"
        style={{
          transform: `translateY(${translateY}px)`,
        }}
      >
        {words.map((word, wIdx) => {
          const isCompleted = wIdx < wordIndex
          const isCurrent = wIdx === wordIndex

          // Handle extra characters typed beyond expected length (capped at 10)
          let extraChars: string[] = []
          if (isCurrent && currentInput.length > word.length) {
            extraChars = currentInput.slice(word.length, word.length + 10).split('')
          } else if (isCompleted && typedWords[wIdx] && typedWords[wIdx].length > word.length) {
            extraChars = typedWords[wIdx].slice(word.length, word.length + 10)
          }

          const showEndCursor = isCurrent && currentInput.length === word.length + extraChars.length

          // Only apply differential opacity once typing has started.
          // Before typing (idle), all words share the same muted look so the
          // first word doesn't appear pre-highlighted — matching MonkeyType UX.
          const opacityClass = phase !== 'running'
            ? (isCompleted ? 'opacity-100' : 'opacity-40')
            : (isCurrent || isCompleted ? 'opacity-100' : 'opacity-40')

          return (
            <span
              key={wIdx}
              ref={isCurrent ? activeWordRef : null}
              className={`inline-block mr-3 whitespace-nowrap transition-opacity duration-200 ${opacityClass}`}
            >
              {/* Expected word characters */}
              {word.split('').map((char, cIdx) => {
                let cls = 'text-secondary'

                if (isCompleted) {
                  const typedChar = typedWords[wIdx]?.[cIdx]
                  cls = typedChar === char ? 'text-correct' : 'text-incorrect'
                } else if (isCurrent) {
                  const typedChar = currentInput[cIdx]
                  if (typedChar === undefined) {
                    cls = 'text-secondary'
                  } else {
                    cls = typedChar === char ? 'text-correct' : 'text-incorrect'
                  }
                }

                const isCursorPos = isCurrent && cIdx === currentInput.length
                const cursorClasses = isCursorPos
                  ? `border-l-2 border-cursor ${phase === 'idle' ? 'animate-cursor-blink' : ''}`
                  : ''

                return (
                  <span
                    key={cIdx}
                    className={`${cls} ${cursorClasses}`}
                  >
                    {char}
                  </span>
                )
              })}

              {/* Extra characters typed */}
              {extraChars.map((char, eIdx) => {
                const cIdx = word.length + eIdx
                const isCursorPos = isCurrent && cIdx === currentInput.length
                const cursorClasses = isCursorPos
                  ? `border-l-2 border-cursor ${phase === 'idle' ? 'animate-cursor-blink' : ''}`
                  : ''

                return (
                  <span
                    key={`extra-${eIdx}`}
                    className={`text-incorrect underline decoration-incorrect ${cursorClasses}`}
                  >
                    {char}
                  </span>
                )
              })}

              {/* End-of-word caret placeholder when cursor is right at the end */}
              {showEndCursor && (
                <span
                  className={`inline-block w-px -mr-px h-cursor-line align-middle border-l-2 border-cursor ${
                    phase === 'idle' ? 'animate-cursor-blink' : ''
                  }`}
                />
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
