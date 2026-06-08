import { useEffect } from 'react'

interface PageMeta {
  title: string
  description: string
  canonical: string
  ogTitle?: string
  ogDescription?: string
  noIndex?: boolean
}

/**
 * Updates <title>, meta description, canonical, and OG tags
 * dynamically on route change. Used by each page component.
 */
export function usePageMeta({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  noIndex = false,
}: PageMeta) {
  useEffect(() => {
    const base = 'https://keytypetest.birajsarkar67.workers.dev'

    // Title
    document.title = title

    // Meta description
    setMeta('name', 'description', description)

    // Robots
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    // Canonical
    setLink('canonical', `${base}${canonical}`)

    // Open Graph
    setMeta('property', 'og:title', ogTitle ?? title)
    setMeta('property', 'og:description', ogDescription ?? description)
    setMeta('property', 'og:url', `${base}${canonical}`)

    // Twitter
    setMeta('name', 'twitter:title', ogTitle ?? title)
    setMeta('name', 'twitter:description', ogDescription ?? description)
    setMeta('name', 'twitter:url', `${base}${canonical}`)

    // Cleanup: restore homepage defaults when component unmounts
    return () => {
      document.title = 'KeyType — Free Online Typing Speed Test | WPM Practice'
      setMeta('name', 'description', 'Free online typing speed test — measure your WPM and accuracy in 15, 30, 60, or 120 second tests. No signup required. Works offline. Start typing now.')
      setMeta('name', 'robots', 'index, follow')
      setLink('canonical', `https://keytypetest.birajsarkar67.workers.dev/`)
      setMeta('property', 'og:title', 'KeyType — Free Online Typing Speed Test | WPM Practice')
      setMeta('property', 'og:description', 'Free online typing speed test — measure your WPM and accuracy in 15, 30, 60, or 120 second tests. No signup required. Works offline. Start typing now.')
      setMeta('property', 'og:url', `https://keytypetest.birajsarkar67.workers.dev/`)
      setMeta('name', 'twitter:title', 'KeyType — Free Online Typing Speed Test | WPM Practice')
      setMeta('name', 'twitter:description', 'Free online typing speed test — measure your WPM and accuracy in 15, 30, 60, or 120 second tests. No signup required. Works offline.')
      setMeta('name', 'twitter:url', `https://keytypetest.birajsarkar67.workers.dev/`)
    }
  }, [title, description, canonical, ogTitle, ogDescription, noIndex])
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function setMeta(attrKey: string, attrVal: string, content: string) {
  let el = document.querySelector(`meta[${attrKey}="${attrVal}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrKey, attrVal)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}
