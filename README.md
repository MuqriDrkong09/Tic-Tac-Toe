# Tic-Tac-Toe

A polished Tic-Tac-Toe game built with **React 18**, **TypeScript**, **MUI Material 6**, and **Vite**.

![Live demo](https://img.shields.io/badge/status-playable-success)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## Features

- Classic 3x3 board with two-player X/O turns
- Animated winning-line stroke across the three winning cells (SVG `pathLength` trick)
- Persistent scoreboard tracking X wins, O wins, and draws across rounds
- **Dark / light mode** toggle, respecting `prefers-color-scheme` and persisted to `localStorage`
- Fully responsive layout (works on mobile and desktop)
- Smooth micro-animations (cell pop, card entrance, board state transitions)
- Keyboard-accessible (auto-focus on "New game" after a round ends)
- Move history drawer with click-to-jump time travel
- Undo / redo via buttons or keyboard shortcuts
- Strongly typed throughout — `BoardState` is a fixed-length 9-tuple, `GameStatus` is a discriminated union

## Keyboard shortcuts

Undo and redo walk backward and forward through the move timeline (the same history shown in the move-history drawer). Shortcuts are ignored while focus is in a text field.

| Action | Windows / Linux | macOS |
|---|---|---|
| **Undo** | `Ctrl` + `Z` | `Cmd` + `Z` |
| **Redo** | `Ctrl` + `Shift` + `Z` or `Ctrl` + `Y` | `Cmd` + `Shift` + `Z` |

Undo is only available when you can step back (after at least one move). Redo is only available when you have previously undone and have future moves to restore.

## Architecture

```
src/
├── main.tsx                  React root, StrictMode wrapper
├── App.tsx                   Layout shell, ThemeProvider, dark/light toggle
├── theme.ts                  createAppTheme(mode) factory
├── types.ts                  Player, Cell, BoardState, GameStatus, WinningLine, ...
├── gameLogic.ts              Pure utilities: calculateWinner, getGameStatus, applyMove
├── gameReducer.ts            History-aware reducer (PLAY_MOVE, UNDO, REDO, JUMP_TO_STEP)
└── components/
    ├── Game.tsx              Stateful container, score tracking, undo/redo, reset controls
    ├── MoveHistory.tsx       Move list for time-travel (opened from menu drawer)
    ├── Board.tsx             3x3 CSS grid + WinningLine overlay
    ├── Square.tsx            Animated MUI ButtonBase cell
    ├── StatusBar.tsx         Player / Winner / Draw banner with icons
    ├── Scoreboard.tsx        Three color-coded score cards
    └── WinningLine.tsx       Animated SVG stroke across winning cells
```

### Key design decisions

- **Single source of truth.** The Game component stores a board timeline (`history` + `currentStep`) via `gameReducer`. Whose turn it is, the winner, the winning line, and the game-over flag are all *derived* from the visible snapshot via `getGameStatus(board)` on every render.
- **Pure logic.** All game rules live in `gameLogic.ts` as side-effect-free functions, making them trivially testable and reusable.
- **Discriminated `GameStatus` union.** `{ kind: 'in_progress' | 'won' | 'draw', ... }` lets the UI exhaustively switch with full type narrowing.
- **Ref-guarded score increment.** A `useRef` flag ensures a round is tallied exactly once, safe against React StrictMode's dev double-invocation.
- **SVG `pathLength={1}` trick.** A single shared keyframe draws any of the 8 winning lines regardless of pixel length.

## Getting started

### Prerequisites

- Node.js 18+ (tested on Node 22)
- npm 10+

### Install & run

```bash
npm install
npm run dev
```

The app will be available at http://localhost:5173 (or the next free port).

### Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check the project and produce a production bundle in `dist/` |
| `npm run preview` | Serve the production build locally for smoke testing |
| `npm run lint` | Run TypeScript in noEmit mode (project-wide type check) |

## License

MIT
