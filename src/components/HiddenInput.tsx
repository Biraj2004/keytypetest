import { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export function HiddenInput({ value, onChange, onKeyDown, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus on mount
    if (!disabled) {
      inputRef.current?.focus()
    }

    const handleClick = () => {
      if (!disabled) {
        inputRef.current?.focus()
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [disabled])

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
      aria-label="Typing input — start typing to begin the test"
    />
  )
}
