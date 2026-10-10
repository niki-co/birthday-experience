# AGENTS.md

## Project overview
A phone-first, interactive birthday web app (a gift that opens in stages). The
whole experience is a sequence of scenes driven by a small progress store.

## Commands
- Install: `npm install`
- Build (static site): `node build.mjs`  → `dist/`
- Build (one self-contained HTML): `node make-single.mjs`
- Verify (headless walk-through + screenshots): `node verify.mjs`

> Low-memory machines: prefix build/serve commands with `ulimit -v unlimited`.
> Vite 8 cannot build here (its bundler uses WebAssembly); the build uses
> **esbuild** via `build.mjs`.

## Stack
React 19 + TypeScript · Tailwind CSS v4 (via PostCSS) · Motion · dnd-kit · esbuild.

## Project structure
- `src/content.json` — **all editable content** (names, text, media paths)
- `src/scenes/` — one file per scene of the journey
- `src/components/` — shared pieces (envelope, motifs, gift viewer, jar, tic-tac-toe)
- `src/lib/` — progress store, real-time lock, microphone hook
- `build.mjs` / `make-single.mjs` — build scripts

## Code style
- TypeScript, function components, Tailwind utility classes plus a small
  `index.css` design system (tokens, motifs, animations).
- Keep personal content out of code — it belongs in `content.json`.

## Boundaries
- ✅ Always: keep `content.json` the single edit surface; keep motion
  reduced-motion-safe; test on a phone viewport.
- 🚫 Never: commit real personal photos/videos to a public repo; hardcode secrets.
