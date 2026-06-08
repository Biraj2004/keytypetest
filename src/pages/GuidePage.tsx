import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'

// ── FAQ data
const FAQS = [
  {
    q: 'What is a good typing speed (WPM)?',
    a: 'The average typing speed is around 40 WPM. A good typing speed for everyday use is 60–80 WPM. Professional typists typically reach 80–100 WPM. Anything above 100 WPM is considered fast. Use KeyType to measure where you stand and track improvement over time.',
  },
  {
    q: 'How is WPM calculated?',
    a: 'WPM (words per minute) is calculated by dividing the number of correctly typed characters by 5 — the standard word length — then dividing by the elapsed time in minutes. KeyType also shows raw WPM, which counts every character you typed right or wrong, so you can see speed vs. accuracy separately.',
  },
  {
    q: 'How can I improve my typing speed?',
    a: 'Consistent daily practice is the most effective method. Take a short typing test every day, focus on accuracy first (95%+ before chasing speed), and avoid looking at the keyboard. Use the home row position — fingers resting on ASDF and JKL;. Speed follows naturally once muscle memory forms.',
  },
  {
    q: 'Is KeyType free to use?',
    a: 'Yes, completely free. No account, no signup, no ads, no paywalls. Just open the site and start typing. It also works offline after the first load so you can practise anywhere without an internet connection.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account is required. KeyType saves your result history locally in your browser — no data is sent to any server. Your typing history is private and stays on your device.',
  },
  {
    q: 'What typing test durations are available?',
    a: 'KeyType offers 15, 30, 60, and 120 second tests. The 15-second test is great for a quick burst. The 30-second test gives a reliable snapshot. The 60-second test is the most widely used standard for measuring WPM. The 120-second test reveals how well you sustain speed and accuracy over time.',
  },
  {
    q: 'What is the difference between WPM and raw WPM?',
    a: 'WPM counts only correctly typed characters toward your score. Raw WPM counts every character you typed — right or wrong. The gap between the two is your error rate. A high raw WPM with low WPM means you are typing fast but making too many mistakes. Close the gap by slowing down slightly and prioritising accuracy.',
  },
  {
    q: 'Can I use KeyType offline?',
    a: 'Yes. KeyType is an offline-first progressive web app (PWA). After your first visit the entire app is cached and runs with no internet connection. You can also install it to your desktop or home screen from the install button for instant one-click access.',
  },
  {
    q: 'What is the difficult mode?',
    a: 'Difficult mode uses less common words, longer words, and more varied vocabulary compared to easy mode. It is designed for users who have already built a solid base speed and want to challenge their typing with unfamiliar patterns.',
  },
  {
    q: 'How do I restart a test?',
    a: 'Press Tab at any time to restart with a new word set. Press Escape during a running test to cancel and return to idle. Press Enter on the results screen to start a new test immediately.',
  },
]

// ── Inline accordion item
function FaqItem({ q, a, isOpen, onClick }: {
  q: string
  a: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div style={{ borderTop: '1px solid var(--color-divider)' }}>
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        className="w-full text-left py-3.5 flex justify-between items-start gap-6 cursor-pointer bg-transparent border-none focus:outline-none"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <span
          className="transition-colors duration-150 text-sm leading-snug"
          style={{ color: isOpen ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
        >
          {q}
        </span>
        <span
          className="shrink-0 transition-transform duration-200 mt-0.5 text-xs"
          style={{
            color: 'var(--color-text-tertiary)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▾
        </span>
      </button>
      {isOpen && (
        <p
          className="pb-4 text-sm leading-relaxed animate-fade-in"
          style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)', marginTop: '-4px' }}
        >
          {a}
        </p>
      )}
    </div>
  )
}

// ── Section heading helper
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs font-semibold uppercase tracking-widest mb-4"
      style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}
    >
      {children}
    </h2>
  )
}

// ── Stat chip
function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col items-center gap-1 px-5 py-3 rounded-lg"
      style={{ background: 'var(--color-surface)' }}
    >
      <span
        className="font-mono text-xl font-medium"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {value}
      </span>
      <span
        className="text-xs"
        style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}
      >
        {label}
      </span>
    </div>
  )
}

// ── Main page
export default function GuidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i))

  usePageMeta({
    title: 'Typing Speed Guide — WPM Tips, FAQ & How to Improve | KeyType',
    description: 'Learn how WPM is calculated, what counts as a good typing speed, and how to improve. Includes benchmarks, practice tips, keyboard shortcuts, and FAQ.',
    canonical: '/guide',
    ogTitle: 'Typing Speed Guide — WPM Tips & FAQ | KeyType',
    ogDescription: 'Learn how WPM is calculated, what good typing speed looks like, and 5 proven ways to improve. Free guide from KeyType.',
  })

  return (
    <div
      className="grow overflow-y-auto animate-fade-in"
      style={{ scrollbarWidth: 'none' }}
    >
      <article
        className="max-w-2xl mx-auto py-8 px-2"
        style={{ fontFamily: 'var(--font-sans)' }}
      >

        {/* ── Page title */}
        <h1
          className="text-2xl font-semibold mb-2 tracking-tight"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}
        >
          Typing Speed Guide
        </h1>
        <p
          className="text-sm leading-relaxed mb-10"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Everything you need to know about WPM, accuracy, and how to improve your typing speed — plus answers to common questions.
        </p>

        {/* ── What is WPM */}
        <section className="mb-10">
          <SectionHeading>What is WPM?</SectionHeading>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            WPM stands for <strong style={{ color: 'var(--color-text-primary)' }}>words per minute</strong> — the standard measure of typing speed. One "word" is defined as five characters, including spaces. So typing 250 characters correctly in one minute equals 50 WPM.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            KeyType shows two numbers: <strong style={{ color: 'var(--color-text-primary)' }}>WPM</strong> (correct characters only) and <strong style={{ color: 'var(--color-text-primary)' }}>raw WPM</strong> (all characters typed). The gap between them is your error rate. Closing that gap is the key to real improvement.
          </p>
        </section>

        {/* ── WPM benchmarks */}
        <section className="mb-10">
          <SectionHeading>WPM Benchmarks</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatChip label="beginner" value="< 30" />
            <StatChip label="average" value="40–55" />
            <StatChip label="good" value="60–80" />
            <StatChip label="fast" value="80–100+" />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
            Most office workers type between 40–60 WPM. Developers and writers often sit around 60–80 WPM. Professional transcriptionists and competitive typists reach 100–150+ WPM. The average for someone who has never practised is around 40 WPM.
          </p>
        </section>

        {/* ── How to improve */}
        <section className="mb-10">
          <SectionHeading>How to Improve Your Typing Speed</SectionHeading>

          <div className="flex flex-col gap-4">
            {[
              {
                title: '1. Accuracy before speed',
                body: 'Chasing speed when you are making frequent errors builds bad habits. Aim for 95%+ accuracy consistently. Speed comes naturally once your muscle memory is clean.',
              },
              {
                title: '2. Use the home row',
                body: 'Rest your left fingers on A S D F and right fingers on J K L ;. Every key on the keyboard is reachable from this position with minimal movement. This is the single biggest mechanical improvement most typists can make.',
              },
              {
                title: '3. Stop looking at the keyboard',
                body: 'Touch typing — typing without looking down — is the goal. Cover your hands with a cloth if needed to break the habit. It feels slow at first. Stick with it for two weeks and your speed will recover and surpass where it was.',
              },
              {
                title: '4. Practise daily, not in long sessions',
                body: 'Ten minutes of focused daily practice beats a two-hour session once a week. Short, consistent repetition is how motor skills get encoded. One 60-second test per day is enough to see measurable improvement within weeks.',
              },
              {
                title: '5. Use difficult mode',
                body: 'Once you are comfortable at 60+ WPM in easy mode, switch to difficult mode. Unfamiliar word patterns force your fingers to adapt and prevent you from coasting on memorised common words.',
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3
                  className="text-sm font-medium mb-1"
                  style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Keyboard shortcuts */}
        <section className="mb-10">
          <SectionHeading>Keyboard Shortcuts</SectionHeading>
          <div className="flex flex-col gap-2">
            {[
              { key: 'Tab', desc: 'Restart test with a new word set (any phase)' },
              { key: 'Esc', desc: 'Cancel a running test and return to idle' },
              { key: 'Enter', desc: 'Start a new test from the results screen' },
            ].map(({ key, desc }) => (
              <div key={key} className="flex items-center gap-4">
                <kbd
                  className="shrink-0 px-2.5 py-1 rounded text-xs font-mono"
                  style={{
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-divider)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {key}
                </kbd>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ */}
        <section className="mb-10">
          <SectionHeading>Frequently Asked Questions</SectionHeading>
          <div role="list">
            {FAQS.map((item, i) => (
              <div key={i} role="listitem">
                <FaqItem
                  q={item.q}
                  a={item.a}
                  isOpen={openIndex === i}
                  onClick={() => toggle(i)}
                />
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--color-divider)' }} />
        </section>

        {/* ── CTA back to test */}
        <div className="flex justify-center pt-2 pb-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-sans text-sm transition-colors duration-150"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>back to typing test</span>
          </Link>
        </div>

      </article>
    </div>
  )
}
