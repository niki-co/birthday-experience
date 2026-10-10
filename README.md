# Birthday Experience

A private-feeling, phone-first **interactive birthday web app** — a template you
can fork and make your own. It unfolds like a gift opening in stages: a sealed
invitation, a time-lock, a password, a delivery, an unwrapping, a cake with
candle-blowing, ten gifts, a tic-tac-toe reveal, personal notes, and a keepsake
booklet she can download from.

Styled with a **Chinese-cinematic** aesthetic — ink night, cinnabar red and
imperial gold, with lanterns, plum blossoms, seal chops, moon gates and scrolls —
but every colour and word is yours to change.

## The journey (scene by scene)
1. **Sealed invitation** — a red envelope with a chop seal and a live countdown.
2. **Time lock** — stays sealed until a set date/time, read from the real clock.
3. **Password** — a birth-year gate, framed in a moon gate.
4. **Delivery** — a courier arrives; she takes the parcel.
5. **Unwrap** — the parcel opens to a magazine cover in a moon gate.
6. **Cake** — balloons rise to reveal her photo and a cake; candles blow out by
   **microphone or tap**, with a gentle three-try gag.
7. **Applause** — the mic drops.
8. **Ten gifts** — each worth 2 points, the tally climbing.
9. **Reveal** — tic-tac-toe (*play with me* / *play alone*); win, lose or draw,
   the cards flip to "Happy Birthday" and the 2 × 10 clue.
10. **Notes → the scroll ties shut → a keepsake booklet** with save buttons.

## Quick start
```bash
npm install
npm run build          # -> dist/
node make-single.mjs   # -> dist/Ananya-Birthday.html (one self-contained file)
```
Then open `dist/index.html`, or serve `dist/` with any static server.

## Make it yours — everything is in one file
Open **`src/content.json`**. That is the whole edit surface — no code required.
The important fields:

| Field | What it is |
|---|---|
| `meta.name` / `meta.from` | her name, your name |
| `invitation.unlockISO` | the date & time it opens, e.g. `"2026-12-31T00:00:00+05:30"` (empty = opens immediately) |
| `invitation.photos` | images for the little TV beside the letter |
| `password.answer` | the password (her birth year by default) |
| `celebration.photo` | the photo revealed at the cake |
| `gifts[]` | the ten gifts — jar stars, certificate, mixtape, photo booth, magazine, reel, coupons, archive, stickers, spinner |
| `notes.items` | your personal notes |
| `keepsakes.items` | the files she can download at the end |

Media paths are just URLs or local paths, e.g. `"src": "media/her-photo.jpg"`.

## Features
- **Resumes** — progress and points are saved in the browser, so she can pause
  and come back.
- **Real time-lock** — sealed until the date, checked against a real clock.
- **Candle blowing** — microphone input, with a tap fallback so it never breaks.
- **Rich motion** — lanterns sway, petals fall, stars unfold, cards flip, the
  scroll rolls shut. All of it respects `prefers-reduced-motion`.
- **Phone-first** — designed for a small screen, one column, thumb-friendly.

## Deploy
Any static host works — Vercel, Netlify, Cloudflare Pages, GitHub Pages, or just
send the single HTML file.

> **A note on privacy.** If your photos and videos are personal, do **not** put
> them on a public host. Either send the single file directly, or host it behind
> access control (for example **Cloudflare Pages + Cloudflare Access**, which is
> free and locks the link to specific family emails).

## Tech
React + TypeScript · Tailwind CSS (via PostCSS) · Motion · dnd-kit · built with
**esbuild** (the build script is `build.mjs`).

## License
MIT — see [LICENSE](LICENSE). Replace `[Your Name]` in it with your own.
