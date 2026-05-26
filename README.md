# Tic-Tac-Toe

A polished tic-tac-toe game with **3×3**, **4×4**, and **5×5** boards, built with **React 18**, **TypeScript**, **MUI Material 6**, and **Vite**.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## Features

### Gameplay

- **Board sizes** — 3×3, 4×4, or 5×5; win by getting **N marks in a row** on an N×N board
- **Two-player mode** — local hot-seat play with custom names
- **vs Computer** — AI opponent with three difficulty levels (see [AI](#ai-opponent))
- **Pre-game setup** — choose size, mode, difficulty, your side (X/O), and player names before each match
- **Persistent scoreboard** — tracks X wins, O wins, and draws across rounds in a session
- **Session flow** — return to setup without losing scores; **Reset all** clears board and scores

### Match controls

- **Undo / redo** — step backward and forward through the move timeline (buttons + keyboard shortcuts)
- **Move history drawer** — list of every move with click-to-jump time travel; badge shows move count
- **New game** — clears the board and history, keeps scores and current setup
- **Setup** — back to the pre-game screen (scores preserved)
- **Reset all** — new board plus zeroed scoreboard

### UI & polish

- **Animated winning line** — SVG stroke drawn across the winning run (any length, any direction)
- **Dark / light mode** — toggle in the header; respects `prefers-color-scheme` and persists to `localStorage`
- **Responsive layout** — cell sizes scale per board dimension; board scrolls on small screens when needed
- **Micro-animations** — cell pop on place, card entrance, “thinking…” indicator during AI turns
- **Sound effects** — click on move, fanfare on win, soft tick on draw; mute toggle in the header (saved to `localStorage`; off by default when `prefers-reduced-motion` is set)
- **Accessibility** — keyboard shortcuts, ARIA labels, focus on **New game** after a round ends

### Technical

- **Pure game logic** — rules in `gameLogic.ts` and `boardRules.ts`; no side effects
- **History-aware reducer** — `gameReducer.ts` holds board snapshots + `currentStep` for undo/redo and branching
- **Strong typing** — `GameStatus` discriminated union, `BoardRules` for size-aware win detection
- **AI module** — `ai.ts` with minimax (3×3 hard mode) and heuristic play for larger boards

## AI opponent

| Difficulty | Behaviour |
|---|---|
| **Easy** | Random empty cell |
| **Medium** | Win if possible → block opponent win → take center → random |
| **Hard** | **3×3:** full minimax with alpha-beta pruning (optimal play) |
| | **4×4 / 5×5:** same heuristic as Medium (minimax is impractical at scale) |

In vs Computer mode you choose **X** (first) or **O** (second). The AI’s name field is disabled; the computer uses “Player X” or “Player O” for the side you don’t control.

## Keyboard shortcuts

Undo and redo walk the same timeline as the move-history drawer. Shortcuts are ignored while focus is in a text field.

| Action | Windows / Linux | macOS |
|---|---|---|
| **Undo** | `Ctrl` + `Z` | `Cmd` + `Z` |
| **Redo** | `Ctrl` + `Shift` + `Z` or `Ctrl` + `Y` | `Cmd` + `Shift` + `Z` |

Undo is available after at least one move. Redo is available only when you have undone and future moves still exist.

## Architecture

```
src/
├── main.tsx                  React root, StrictMode
├── App.tsx                   Layout shell, ThemeProvider, dark/light toggle
├── theme.ts                  createAppTheme(mode)
├── types.ts                  Player, BoardState, GameConfig, GameStatus, …
├── boardRules.ts             Board size, empty board, cell dimensions, N-in-a-row rules
├── gameLogic.ts              calculateWinner, getGameStatus, applyMove, getMoveAtStep
├── gameReducer.ts            History timeline: PLAY_MOVE, UNDO, REDO, JUMP_TO_STEP, NEW_GAME, RESET
├── ai.ts                     pickAiMove, isAiTurn (easy / medium / hard + minimax)
├── soundSettings.ts          localStorage + reduced-motion default for sound
├── soundEffects.ts           Web Audio synthesized move / win / draw SFX
├── SoundContext.tsx          Global sound toggle and play helpers
└── components/
    ├── Game.tsx              Setup ↔ playing phases; session score state
    ├── PreGameSetup.tsx      Board size, mode, AI options, names
    ├── GameSession.tsx       Active match: board, controls, history drawer, AI effect
    ├── Board.tsx             CSS grid + WinningLine overlay
    ├── Square.tsx            Animated cell (size scales with board)
    ├── StatusBar.tsx         Turn / winner / draw banner
    ├── Scoreboard.tsx        X / O / draws cards
    ├── MoveHistory.tsx       Move list for time travel
    └── WinningLine.tsx       Animated SVG stroke along winning cells
```

### Key design decisions

- **Phased UI.** `Game.tsx` switches between `PreGameSetup` and `GameSession`. `GameConfig` is fixed for a match; **Setup** returns to pre-game without clearing the scoreboard.
- **Single source of truth.** `GameSession` stores `history` + `currentStep` via `gameReducer`. Turn, winner, winning line, and game-over state are derived from the visible board with `getGameStatus(board, rules)`.
- **Parameterized rules.** `BoardRules` carries `size` and `winLength` so win detection, empty boards, and AI all work for 3×3 through 5×5.
- **Branching history.** `PLAY_MOVE` while viewing an older step truncates future snapshots (standard time-travel semantics).
- **Ref-guarded scoring.** A `useRef` flag ensures each finished round increments the score exactly once (safe under React StrictMode).
- **SVG `pathLength={1}`.** One keyframe animates winning lines of any length and angle.

## Getting started

### Prerequisites

- Node.js 18+ (tested on Node 22)
- npm 10+

### Install & run

```bash
npm install
npm run dev
```

Open http://localhost:5173 (or the next free port Vite prints).

### Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and produce a production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | TypeScript project-wide type check (`tsc -b --noEmit`) |

## Roadmap

Planned improvements (tests, CI, deploy, sounds, PWA, i18n, online play, and more) are listed in [ROADMAP.md](./ROADMAP.md).

## License

MIT
