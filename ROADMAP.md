# Roadmap

Future ideas for evolving the Tic-Tac-Toe project, grouped by effort and impact.

Pick whatever interests you next — they're roughly ordered from "biggest payoff for least effort" to "biggest scope".

## Quick wins

Small, focused tasks with high payoff. Ideal starting points.

- [ ] **Vitest + Testing Library** — unit-test `gameLogic.ts`
  (`calculateWinner`, `getGameStatus`, `applyMove`, `getNextPlayer`).
  Those pure functions are perfect candidates and will unlock safe
  refactoring for everything below.
- [ ] **GitHub Actions CI** — workflow that runs install → type-check →
  build → test on every push and PR. Protects `main` from regressions.
- [ ] **Deploy** — publish the production build to GitHub Pages
  (or Vercel / Netlify). Add a live-demo badge to `README.md`.

## Features

Meaningful new functionality.

- [ ] **Move history sidebar** — list every move ("X to 4", "O to 0", …)
  with click-to-jump time travel.
- [ ] **Undo / Redo** — buttons + keyboard shortcuts (`Ctrl+Z` /
  `Ctrl+Shift+Z`). Best done by refactoring `Game` state into a
  history-aware reducer; pairs naturally with the move-history sidebar.
- [ ] **Single-player AI** — three difficulties:
  - *Easy* — pick a random empty cell.
  - *Medium* — block opponent's winning move, otherwise play a winning
    move, otherwise random.
  - *Hard* — full **minimax** with alpha-beta pruning. Tic-Tac-Toe is
    small enough to solve optimally instantly.
- [ ] **Pre-game setup screen** — choose mode (P vs P / P vs AI), AI
  difficulty, who plays X first, optional player names.
- [ ] **Configurable board size** — 3x3 / 4x4 / 5x5 with generalised
  N-in-a-row win detection. Requires rewriting `BoardState` from a
  fixed-9 tuple to a parameterised `Cell[]` (or `Cell[][]`).

## Polish

Delightful touches that don't add gameplay but lift the feel.

- [x] **Sound effects** — soft click on cell place, fanfare on win,
  tick on draw. Toggleable in settings, preference persisted to
  `localStorage`. Honour `prefers-reduced-motion` / a "sound off"
  default for accessibility.
- [ ] **PWA support** — add `manifest.json` and a service worker
  via `vite-plugin-pwa`. Installable on desktop / mobile, plays
  offline.
- [x] **Confetti burst on win** — using a lightweight library
  (e.g. `canvas-confetti`) or a hand-rolled canvas animation.
  Skip entirely if `prefers-reduced-motion` is set.
- [ ] **Internationalisation (i18n)** — `react-i18next`. Ship English
  plus one or two extra locales (e.g. Malay, Spanish).

## Stretch goals

Significant scope. Treat as projects of their own.

- [ ] **Online multiplayer** — over WebSockets. Room codes, shareable
  join links, real-time state sync, graceful reconnect handling.
  Stack idea: Socket.IO server on a tiny Node host, or a server-less
  approach via Cloudflare Durable Objects.
- [ ] **Persistent profile + match history** — store completed games
  in IndexedDB (via Dexie) or `localStorage`. Show win-rate stats
  over time, opening-move frequency, average game length, etc.
- [ ] **Tournament / best-of-N mode** — bracket UI, persistent score,
  configurable round count.

## Suggested order

If you want a natural progression:

1. **Tests** (unlocks safe refactoring)
2. **CI + Deploy** (small effort, app is now live and protected)
3. **Undo/Redo** (refactors `Game` into a reducer; sets up the next)
4. **Move history sidebar** (almost free once the reducer is in place)
5. **AI mode** (the most fun gameplay addition; `gameLogic.ts` already
   has the primitives it needs)
6. Pick polish items by taste
7. **Online multiplayer** (last — needs a server)
