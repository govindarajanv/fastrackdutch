# My Dutch Daily Course Notes — Working Guide

Personal phrase revision player for an external Dutch course. **Separate from FastrackDutch** (`../index.html`).

| | |
|---|---|
| **File** | `course-phrases/index.html` (single file — HTML, CSS, JS, data) |
| **Title** | My Dutch Daily Course Notes v*major*.*minor*.*patch* |
| **Version** | **v1.8.3** (independent semver — not tied to FastrackDutch) |
| **Link from main app** | Header → `course-phrases/` |
| **Deploy** | Copied with `index.html` via `.github/workflows/deploy.yml` |

---

## Critical Rules

### Read before editing

Always Read the exact line range in `index.html` before editing (~600+ lines). Use targeted reads, not full-file reads.

### Never use subagents to modify `index.html`

Same wipeout risk as the main app. Edit directly in the conversation.

### Bump `VERSION` on every meaningful change

Update `VERSION` at the top of the script block and follow semver below. `applyVersion()` sets the tab title and `#app-title` header.

---

## Versioning (semver)

Single source of truth:

```js
const VERSION = { major: 1, minor: 8, patch: 3 };
```

| Bump | When | Examples |
|------|------|----------|
| **MAJOR** | Breaking restructure | New data model, removed chapters, layout that breaks editing workflow |
| **MINOR** | New capability or content chapter | New chapter, Play Dutch/Both, floating controls, new column |
| **PATCH** | Small fixes and content tweaks | Typo fixes, pronunciation guide fixes, phrase order, pause bugfix |

Rules:
- Reset lower segments on bump (`1.8.3` → `1.9.0` for minor; `2.0.0` for major).
- One bump per change set (don’t skip version numbers).
- Do **not** sync with FastrackDutch’s version badge.

---

## Data Shape

All content lives in the `CHAPTERS` array:

```js
const CHAPTERS = [
  {
    title: 'Chapter 1: Introducing Yourself',
    phrases: [
      { dutch: 'Hallo', pron: 'HAH-loh', english: 'Hello' },
      // ...
    ],
  },
];
```

| Field | Purpose |
|-------|---------|
| `title` | Chapter header row in the table (`Chapter N: …`) |
| `phrases` | Array of rows for that chapter |
| `dutch` | Dutch phrase or word (spoken for 🔊 and queue Dutch step) |
| `pron` | English phonetic guide for the learner — **not** spoken |
| `english` | English meaning (spoken after Dutch in ▶ / Play Both) |

Runtime helpers (do not edit manually):
- `PHRASES = CHAPTERS.flatMap(ch => ch.phrases)` — flat list for global index
- `CHAPTER_RANGES` — start/end indices per chapter for queue playback

### Adding content

1. Add phrases to the right chapter’s `phrases` array (or add a new chapter object).
2. Sort phrases in pedagogical order (not necessarily A–Z).
3. Use correct Dutch spelling in `dutch`; keep numerals as words when teaching numbers (e.g. *vierenveertig*, not `44`).
4. Bump **MINOR** for a new chapter; **PATCH** for phrases added to an existing chapter.

### Pronunciation guide (`pron`)

Same conventions as FastrackDutch:
- CAPS = stressed syllable
- `kh` = Dutch G/ch · `ay` = long A · `oo`/`oh` = Dutch oe/oo
- `main` ≈ *mijn* · `un` ≈ *een* · `yay` ≈ *jij*
- Spell out Dutch numbers in phonetics (e.g. `FEER-en-FAYR-tikh` for *vierenveertig*) — no bare numerals in `pron`

---

## UI Conventions

### Layout

- Sticky header: title + version + link back to FastrackDutch (`../index.html`)
- One table inside `.card`; chapter section headers are `.ch-hdr` rows
- Toolbar: phrase/chapter count, **Pause**, **Play All**
- Floating bar (`#float-ctrl`): **Pause/Resume** + **Stop** — visible during active or paused playback

### Row controls

| Control | Class / ID | Action |
|---------|------------|--------|
| 🔊 | `.spk-btn` | Dutch only |
| ▶ (last column) | `.pbtn` | Dutch → 380ms → English |
| ▶ Play Dutch | `.pc-btn[data-mode=dutch]` | Queue chapter, Dutch only |
| ▶ Play Both | `.pc-btn[data-mode=both]` | Queue chapter, Dutch then English per row |

Active queue button shows **■ Stop** (`.pc-btn.active`).

### Colours (match FastrackDutch)

- `--blue: #003082` — header, Dutch column, 🔊, pause
- `--orange: #E77500` — ▶ buttons, Play All, chapter play, Stop

### Pause / resume

- Do **not** rely on `speechSynthesis.pause()` / `resume()` alone (unreliable on Windows).
- Use `pauseSnapshot` + replay from saved position (`pausePlayback` / `resumePlayback`).
- Toolbar pause and floating pause stay in sync via `updatePauseBtn()`.

---

## TTS Notes

- Web Speech API, `nl-NL`, rate `0.88` for Dutch; `en-US`, rate `1.0` for English
- Android: voice poll + 14s `pause()`/`resume()` keepalive in `startTTSResume()`
- `#voice-warn` shown when no Dutch voice is found

---

## Current Chapters (v1.8.3)

1. Introducing Yourself  
2. Family  
3. Describing People  
4. To Be & To Have  
