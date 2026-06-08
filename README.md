<p align="center">
  <img src="public/favicon.svg" width="64" height="64" alt="KeyType logo" />
</p>

<h1 align="center">KeyType</h1>

<p align="center">
  A distraction-free, offline-first typing speed test. Measure WPM and accuracy in 15, 30, 60, or 120 second tests — no account, no ads, no noise.
</p>

<p align="center">
  <a href="https://keytype.pages.dev">keytype.pages.dev</a>
</p>

---

## Stack

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
</p>

---

## Features

- **Live stats** — WPM, raw WPM, and accuracy update in real time
- **Four test durations** — 15, 30, 60, and 120 seconds
- **Offline-first PWA** — fully functional after first load, installable on desktop
- **Result history** — last 50 results persisted to localStorage
- **Zero backend** — no auth, no network fetches, no database
- **Keyboard-first** — `Tab` restarts, `Esc` cancels, `Enter` continues from results

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build          # TypeScript check + Vite production build → dist/
npm run deploy         # build + wrangler deploy to Cloudflare Workers
```

## Project Structure

```
src/
├── components/        # Presentational UI components
├── hooks/             # useTypingEngine, useTimer, usePageMeta
├── lib/               # Pure stat functions, localStorage helpers
├── data/              # Static word pool (~1000 words)
├── pages/             # Route-level page components
└── types/             # Shared TypeScript types
```

## License

Licensed under the [Apache License 2.0](LICENSE).
