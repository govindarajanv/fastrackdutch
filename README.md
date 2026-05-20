# FastrackDutch

**Fast-track Dutch learning for Indian expats in the Netherlands.**

Live app: **https://govindarajanv.github.io/fastrackdutch/**

---

## What it is

A single-file, offline-capable Dutch language learning app. No installation, no account, no server — open `index.html` in any browser and start learning.

Built around the realities of expat life: housing, transport, healthcare, work, grocery shopping, and social integration — with pronunciation guides tuned for Indian English speakers.

---

## Features

- **70 chapters** organised by CEFR level (A1 → A2 → B1)
- **Cheat Code chapter** — predict Dutch vocabulary from English using letter-swap formulas and cognates
- **Dictionary** — all words aggregated, searchable, grouped by alphabet / chapter / level
- **Flash Cards** — vocabulary drill with All / By Theme / By Chapter / A1 / A2 / B1 modes
- **Audio playback** — Web Speech API (Dutch `nl-NL` voice); Play Chapter, Play Course, Play All in Dictionary
- **Read EN toggle** — choose whether English meaning is read aloud alongside Dutch
- **Dark / Light theme** — persisted in `localStorage`
- **Progress tracking** — mark chapters done; progress bar in header
- **Global search** — instant search across all chapters
- **CEFR badges** — colour-coded A1 / A2 / B1 on every chapter card and sidebar item

---

## How to use

1. Clone or download this repo
2. Open `index.html` in any modern browser
3. No internet connection required after the first load (Web Speech API needs a voice installed)

Or just visit the live app: https://govindarajanv.github.io/fastrackdutch/

---

## Tech

| | |
|---|---|
| Stack | Plain HTML + CSS + JavaScript (ES6) |
| Dependencies | None |
| Build step | None |
| Single file | `index.html` (~2500 lines) |
| Audio | Web Speech API — `nl-NL` voice, rate 0.88 |
| Storage | `localStorage` only (progress, theme, EN toggle preference) |

---

## Repo structure

```
index.html      # The entire app
CLAUDE.md       # Working guide for Claude Code (AI assistant context)
README.md       # This file
LICENSE         # MIT License
.github/
  workflows/
    deploy.yml  # Auto-deploys index.html to govindarajanv/fastrackdutch on push
```

---

## Deployment

The source lives in this repo (private). A GitHub Actions workflow automatically pushes `index.html`, `README.md`, and `LICENSE` to the public [fastrackdutch](https://github.com/govindarajanv/fastrackdutch) repo whenever they change on `main`. GitHub Pages serves the app from there.

---

## License

MIT — see [LICENSE](LICENSE).
