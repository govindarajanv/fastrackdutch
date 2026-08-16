# My Dutch Daily Course Notes — Working Guide

Personal phrase revision player for an external Dutch course. **Separate from FastrackDutch** (`../index.html`).

| | |
|---|---|
| **File** | `course-phrases/index.html` (single file — HTML, CSS, JS, data) |
| **Title** | My Dutch Daily Course Notes v*major*.*minor*.*patch* |
| **Version** | **v1.29.0** (independent semver — not tied to FastrackDutch) |
| **Phrases** | **742** |
| **Chapters** | **22** |
| **Unique words** | **650** |
| **Link from main app** | Header → `course-phrases/` |
| **Deploy** | Copied with `index.html` via `.github/workflows/deploy.yml` |

---

## Critical Rules

### Git pull at session start

**Always run `git pull` before starting work.** The remote is sometimes updated by other Cursor sessions (a parallel session added Ch.12 Seasons while another was adding a different chapter), so the local branch can be stale — starting from a stale base causes version/chapter-number collisions and rejected pushes. Confirm `git status` shows `up to date with 'origin/main'` before editing. If a push is rejected, do **not** force-push — pull/rebase and reconcile (renumber chapters / bump versions / recompute metadata) instead. See the root `../CLAUDE.md` for the same rule repo-wide.

### Read before editing

Always Read the exact line range in `index.html` before editing (~600+ lines). Use targeted reads, not full-file reads.

### Never use subagents to modify `index.html`

Same wipeout risk as the main app. Edit directly in the conversation.

### Bump `VERSION` on every meaningful change

Update `VERSION` at the top of the script block and follow semver below. `applyVersion()` sets the tab title and `#app-title` header.

### Update phrase & unique-word counts on every commit

The toolbar stats line in `index.html` is computed at runtime (`PHRASES.length`, `countUniqueDutchWords()`). The **metadata table above** (`**Phrases**`, `**Chapters**`, `**Unique words**`) is the documented snapshot — keep it in sync whenever you add, remove, or edit phrases.

Before every commit that touches `CHAPTERS` data or this guide:

1. Run `node course-phrases/check-pronunciation.js`
2. If it reports a CLAUDE.md count mismatch, update the three **N** values in the metadata table to match the script output
3. Commit only when the check passes (0 failures)

Unique-word tokenisation (must match `countUniqueDutchWords()` in `index.html`): lowercase each `dutch` field, split on whitespace/punctuation, ignore tokens of length 1.

---

## Versioning (semver)

Single source of truth:

```js
const VERSION = { major: 1, minor: 28, patch: 4 };
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
2. Sort phrases in pedagogical order (not necessarily A–Z): **vocabulary / single words first**, then **sentences and dialogue** at the bottom of each chapter.
3. Use correct Dutch spelling in `dutch`; keep numerals as words when teaching numbers (e.g. *vierenveertig*, not `44`).
4. Bump **MINOR** for a new chapter; **PATCH** for phrases added to an existing chapter.
5. **Run `node course-phrases/check-pronunciation.js` after adding/editing phrases**, before committing. It catches bare numerals, multi-syllable words with no CAPS stress marker, the same phrase transcribed two different ways, and **CLAUDE.md phrase/chapter/unique-word count drift** — all mechanical, zero-dependency checks (see the file header for what it does and doesn't catch). It does **not** verify phonetic accuracy or catch structural inconsistencies across parallel constructions (e.g. sibling greetings that should share a stress pattern) — that still needs an actual read-through by whoever/whatever is making the change.
6. **Update the metadata table** (`**Phrases**`, `**Chapters**`, `**Unique words**`) when counts change — the check script fails if these don't match `index.html`.

### Exercises (translation tasks)

Each content chapter gets **4 exercises** in the `EXERCISES` array at the bottom of `index.html` — exercises 1–2 are integrative multi-chapter scenarios; exercises 3–4 are labeled **Exercise 3** / **Exercise 4** and focus on chapter-aligned revision. Exercises are **not** counted as phrases or chapters.

**Mandatory rule — integrative, not repetitive:**

When writing or rewriting exercises for chapter *N*, **never** copy or lightly rephrase phrases from chapter *N* (or any single chapter). Each exercise must be a **new English prompt** whose Dutch answer **combines vocabulary and grammar from multiple chapters 1 through *N***, forcing the learner to recall and apply everything learned so far.

| Do | Don't |
|----|-------|
| Cross-chapter scenarios (e.g. Ch.15 *net zo mooi als* + Ch.13 *jurk* + Ch.12 *zaterdagavond* + Ch.2 *moeder* + Ch.6 *blauwe auto*) | Repeat a sentence from the new chapter with one word changed |
| Use the **new chapter's grammar pattern** in a fresh context | Quote Amsterdam/Amstelveen or animal superlative chains verbatim from Ch.15 |
| Label `Chapter N — Exercise M — Translate to Dutch: "…"` (M is 1–4 per chapter) | Reuse the chapter's example sentences as answers | read the target chapter's phrases and confirm **neither exercise answer appears in that chapter** (or is a trivial variant). Prefer the style established in v1.16.2+ and Ch.13/14 user-authored multi-chapter scenarios.

When adding a new chapter, always add its 4 exercises in the **same change set** — do not defer exercises to a follow-up.

### Pronunciation guide (`pron`)

Same conventions as FastrackDutch:
- CAPS = stressed syllable
- `kh` = Dutch G/ch · `ay` = long A · `oo`/`oh` = Dutch oe/oo
- `main` ≈ *mijn* · `un` ≈ *een* · `yay` ≈ *jij*
- Spell out Dutch numbers in phonetics (e.g. `FEER-en-FAYR-tikh` for *vierenveertig*) — no bare numerals in `pron`
- **Dutch `v`** is softer than English `v`, often near **`f`** — use **`f`** in `pron` for Dutch *v* (*vader* → FAH-der, *voor* → foor, *Veel* → fayl). Word-final *v* devoices to **f** (*geef* → khayf). **Dutch `w`** is a soft blend — still written as **`v`** in the guide (*wil* → vil, *wij* → vay, *water* → VAH-ter); do not change those to `f`.

**Dutch guttural g/ch — always use `kh`, never English hard `g` (`guh`, `GRAH`, `g` where Dutch has achter-R g):**

| Dutch pattern | Write as | Examples |
|---------------|----------|----------|
| **ge-** prefix | **khuh-** | *gezin* → khuh-ZIN · *gesprek* → khuh-SPREK · *gereserveerd* → khuh-ray-zer-VAYRT |
| **goed / goede** | **khoo-** | *goedemorgen* → khoo-duh-MOR-khen · *goede man* → KHOO-duh man |
| **gr-** cluster | **KHRO-** / **KHRAH-** | *groen* → khroon · *grote* → KHROH-tuh · *grappige* → KHRAH-pi-khuh |
| **-ig / -lijk** suffix | **-ikh-** / **-likh-** | *vrolijk* → FROH-likh · *vrolijke* → FROH-likh-uh · *grappige* → KHRAH-pi-khuh |
| **graag** | **khraakh** | *Ik wil graag* → ik vil khraakh … |
| **mag** (verb) | **makh** | *Mag ik* → makh ik … |

**Not guttural:** *mooi* → **MOH-ee** (no g; long o + ee glide). *blij* / *blije* → **blay** / **BLAY-uh** (ij diphthong, not g).

**Before marking any phrase-editing task complete**, re-read every changed `pron` against the table above, run `node course-phrases/check-pronunciation.js` (must exit 0), and scan the full chapter for the same Dutch word transcribed two different ways in sibling rows (e.g. all *gesprek* lines must use `khuh-SPREK`).

---

## UI Conventions

### Layout

- Sticky header: title + version + link back to FastrackDutch (`../index.html`)
- Settings bar (`.settings-bar`, above the toolbar): **Speed** slider (0.5×–1.5×) and **Dutch voice** / **English voice** dropdowns
- One table inside `.card`; chapter section headers are `.ch-hdr` rows
- Toolbar: phrase/chapter count, **Pause**, **Play All**
- **Bookmarks** section (always first, before Chapter 1): starred phrases for quick practice; **Play Dutch** / **Play Both** when non-empty
- Floating bar (`#float-ctrl`): **Pause/Resume** + **Stop** — visible during active or paused playback

### Speed & voice settings

- `ttsSpeed` (default `1`) multiplies both `nlRate()`/`enRate()` base rates (0.88 / 1.0); persisted in localStorage `cp_speed`. Changing the slider mid-playback only affects the next utterance (browsers can't change rate on an in-flight `SpeechSynthesisUtterance`). **`speakText()` sets `u.rate` after `u.voice`** — assigning voice first resets rate on some browsers.
- `dutchVoice` / `englishVoice` are resolved in `loadVoices()`: explicit user pick (localStorage `cp_voice_nl` / `cp_voice_en`, matched by `voice.name`) → else first `nl-NL`/`en-US` voice → else first voice in that language family. Dropdowns are rebuilt every time `loadVoices()` runs (safe — it re-applies the saved name each time) since Android populates the voice list progressively.

### Row controls

| Control | Class / ID | Action |
|---------|------------|--------|
| 🔊 | `.spk-btn` | Dutch only |
| ★ / ☆ | `.bm-btn` | Toggle bookmark (persisted in `localStorage['cp_bookmarks']` — array of phrase indices) |
| ↓ Export / ↑ Import | `.bm-export` / `.bm-import` | Save/load bookmarks as JSON (`{ format, app, appVersion, exportedAt, phraseCount, bookmarks: [{ index, dutch }] }`). Import matches by `dutch` text if indices drift. Replaces current bookmarks. |
| ▶ (last column) | `.pbtn` | Dutch → `GAP_MS` (700ms) → English |
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

- Web Speech API, `nl-NL` base rate `0.88`, `en-US` base rate `1.0` — both scaled by `ttsSpeed` (see Speed & voice settings above)
- `GAP_MS` (`700`) — pause between Dutch and English within a phrase (was `380`; bumped because 380ms read as no gap at all)
- Android: voice poll + 14s `pause()`/`resume()` keepalive in `startTTSResume()`
- `#voice-warn` shown when no Dutch voice is found

---

## Known Issues / Technical Debt

- **`.play-cell` CSS class is dead code.** Added in v1.8.3 for a play-cell wrapper that was never applied to any element in the render template. Safe to delete, or finish wiring it up — not done as of v1.9.1.
- **Queue playback highlights the wrong button.** During Play Chapter / Play Dutch / Play All, `highlightRow()` only adds `.playing` to `.spk-btn` (the small 🔊 icon). `.pbtn.playing` (the bigger ▶ button, with its pulse animation) is now only reachable via a single-row ▶ click — before the v1.8.3 refactor, queue playback highlighted `.pbtn` instead. **Fixed in v1.12.2** — full row highlight + auto-scroll during queue playback.
- **Version numbering starts at v1.8.3, not v1.0.0.** The very first commit to add semver (v1.8.3) was retroactive — no real v1.0–v1.7 ever existed. Don't read early version numbers as evidence of prior releases.

## Verifying changes

There is no dev server for this static file, and no project run-skill or `chromium-cli` exists here. To actually exercise the page (not just eyeball the diff) in a headless environment: a Chrome binary may already be cached at `~/.cache/puppeteer/chrome/win64-*/chrome-win64/chrome.exe` (a side effect of the globally-installed `@mermaid-js/mermaid-cli` npm package, which bundles `puppeteer-core` under `<npm root -g>/@mermaid-js/mermaid-cli/node_modules/puppeteer-core`). Launch it with `puppeteer.launch({ executablePath: <that chrome.exe>, headless: 'new' })`, `page.goto('file:///' + absolute path to index.html)`, then assert with `page.evaluate()` and check `page.on('pageerror'/'console')` for errors. Caveat: headless Chrome's `speechSynthesis.getVoices()` returns a stub list, not real OS TTS voices — this proves the DOM/state logic works, not that the audio itself sounds right. If this becomes a recurring need, run `/run-skill-generator` to turn it into a proper project skill.

---

## Version History

- **Pre-1.8.3 (unversioned)**: page created as "Dutch Course Phrases" — single ▶ per row (Dutch → English), one "▶ Play Chapter" button per chapter, no pause/resume, no floating bar. Grew to 4 chapters (Introducing Yourself, Family, Describing People, To Be & To Have) before semver was introduced.
- **v1.8.3**: first versioned release. Added pause/resume (`pauseSnapshot`/`pendingAdvance` state machine, survives `speechSynthesis.cancel()` races), floating control bar, split "Play Chapter" into separate **Play Dutch** / **Play Both** buttons, added per-row 🔊 Dutch-only button, added semver + this CLAUDE.md.
- **v1.9.0**: speed slider (0.5×–1.5×, `localStorage['cp_speed']`), Dutch/English voice dropdowns (`localStorage['cp_voice_nl']`/`['cp_voice_en']`), Dutch↔English gap increased from 380ms to 700ms (`GAP_MS`) — 380ms read as no pause at all.
- **v1.9.1**: pronunciation fixes — consistent stress across the five `goede-`+time-word greetings (Goedendag/Goedemorgen/Goedemiddag/Goedenavond/Goedenacht), `Nationaliteit` corrected to stress the final `-TAYT` syllable (Dutch `-iteit` words are end-stressed), `Arthur` corrected from `AR-thur` to `AR-tur` (Dutch has no "th" phoneme — matches how `Judith` was already handled).
- **v1.10.0**: Chapter 5 — Food, Meals & Ordering (meals, food vocabulary, eat/drink sentences, restaurant phrases).
- **v1.10.1**: Complete ordering templates — `Ik wil graag koffie`, `Ik neem pasta` (from chapter food vocab).
- **v1.10.2**: Complete `Mag ik de rekening, alstublieft?` (pairs with *De rekening, alstublieft.*).
- **v1.10.3**: Remove duplicate *De rekening, alstublieft.* — covered by *Mag ik de rekening, alstublieft?*
- **v1.10.4**: Reorder Ch.5 restaurant dialogue; add *Ja, mag ik een koffie?* after *Weet u het al?*
- **v1.10.5**: All chapters — vocabulary/words at top, phrases and sentences at bottom.
- **v1.10.6**: Ch.5 — consistent `de`/`het` on meal and food vocab (*de lunch*, *het diner*, *de koffie*, *de melk*, *de thee*, *de pasta*, *de snack*, *het eten*); removed duplicate bare *brood*.
- **v1.11.0**: Chapter 6 — Adjectives (base forms, inflected *de*/*het* phrases, stacked adjectives).
- **v1.11.1**: Dutch *v* → *f* in pronunciation guide where appropriate; fix speed slider (set utterance rate after voice assignment).
- **v1.12.0**: Bookmarks — ☆/★ per row, **Bookmarks** practice section at top (before Chapter 1), Play Dutch/Both for bookmark list; persisted in `localStorage['cp_bookmarks']`.
- **v1.12.1**: Stats line shows unique Dutch word count (tokenised from all `dutch` fields).
- **v1.12.2**: Playing row highlighted + auto-scroll during queue and single-row playback.
- **v1.12.3**: Softer row highlight (light blue wash, single left accent); no pulsing buttons during chapter playback.
- **v1.12.4**: Pronunciation fixes — *gesprek* → khuh-SPREK, *grappige* → KHRAH-pi-khuh, *gereserveerd* → khuh-…; *-lijk* → *-likh-*; guttural-g rules + check-script guards in CLAUDE.md.
- **v1.13.0**: Bookmark **↓ Export** / **↑ Import** — JSON file to/from local device; import resolves by Dutch phrase text if indices change.
- **v1.13.1**: Ch.6 heading row — *Bijvoeglijke naamwoorden* only (drop inline English).
- **v1.14.0**: Chapter 7 — Getting Groceries (supermarket departments, weighing, checkout dialogue, wegen/kosten/pinnen).
- **v1.14.1**: Ch.7 — complete *wegen*/*betalen* conjugation rows with *het vlees*, *de boodschappen*, *de kassa*.
- **v1.14.2**: Ch.7 — add *de afdeling* vocabulary row.
- **v1.14.3**: Ch.7 — add *betalen* and *kopen* vocabulary rows.
- **v1.15.0**: Chapter 8 — Restaurant (waiter, menu, table, ordering, courses, paying, restaurant types, reserving a table).
- **v1.15.1**: Ch.8 — split *Dat wordt dan vijfenzestig euro. Pinnen of contant?* into two separate rows.
- **v1.16.0**: Add a separate **Exercises** section at the bottom with 10 translation / sentence-formation tasks based on Chapters 1–8. Answers are hidden behind a "Show answer" expander; exercises are not counted as phrases or chapters.
- **v1.16.1**: Add **expand/collapse** toggle buttons to each chapter header. Rows get `data-chapter` attributes and the `hidden` class when collapsed (chapters collapsed by default since v1.17.1).
- **v1.16.2**: Rewrite the 10 Exercises so answers are new combinations of chapter vocabulary and grammar, not direct copies of existing phrases.
- **v1.16.3**: Expand Exercises to **16 tasks** (2 per chapter), each labeled with its chapter and using fresh vocabulary/grammar combinations.
- **v1.16.4**: Add expand/collapse to the **Exercises** section (collapsed by default since v1.17.3); fix pronunciations: *alsjeblieft* → `ALS-yuh-bleeft` and *Tot ziens* → `tot ZEENS`.
- **v1.16.5**: Fix Exercises expand/collapse CSS bug; replace silly exercise *De grote beer is klein* with *De grote beer is trots*; add **Print / PDF** toolbar button that opens the browser print dialog with a print stylesheet.
- **v1.16.6**: Replace *De grote beer is trots* exercise with *De kleine auto is groen. Het witte huis is mooi.* — a more sensible description.
- **v1.17.0**: Chapter 9 — Questions (yes/no inversion, question words, WH-questions, statement→question pairs).
- **v1.17.1**: Chapters start **collapsed** by default (+ to expand); auto-expand during chapter playback so highlight/scroll still work.
- **v1.17.2**: Add **2 Exercises** for Chapter 9 (18 tasks total, 2 per chapter).
- **v1.17.3**: Exercises section starts **collapsed** by default (same +/− toggle as chapters).
- **v1.18.0**: Chapter 10 — Counting (0–20, compound numbers, hundreds/thousands, counting dialogue, age); **2 Exercises** (20 tasks total).
- **v1.18.1**: Rewrite Exercises for tighter chapter alignment — Ch.9/10 use chapter question/counting patterns; fix Ch.2 (*meisje* → *dochter/zus*), Ch.7 (*kaas/supermarkt* → *brood/bakkerij*, checkout dialogue).
- **v1.18.2**: Improve Ch.9/10 Exercises — inversion drill + vraagwoorden pair; counting dialogue with *drieëntwintig* + age with *dertig*.
- **v1.18.3**: Replace Ch.9/10 Exercises with user-authored tasks (*hoeveel mensen*, morning inversion, *fruitafdeling*/*zevenenzestig*, *grote huis*/*tochtig*).
- **v1.18.4**: Ch.9 ex2 → supermarket with *opa*; Ch.10 ex2 → *Hoe oud is dat grote huis? Tachtig.*
- **v1.18.5**: Ch.9 ex2 → *Ik woon in Utrecht met mijn familie.*
- **v1.18.6**: Ch.9 ex2 answer → *mijn gezin* (matches Ch.2 *gezin*).
- **v1.18.7**: Ch.9 ex2 → *in de stad Utrecht* (explicit “city” word order).
- **v1.18.8**: Ch.10 ex2 → *dat grote witte huis* / *Tachtig jaar oud.*
- **v1.19.0**: Chapter 11 — Telling Time (clock/watch/alarm vocabulary, day periods, *Hoe laat is het?*, full hour/quarter/half-past telling from 11:00 → 12:00, klokkijken terminology: linker/rechter, hele/halve uren, kwartieren); 34 new phrases; **2 Exercises** (22 tasks total).
- **v1.19.1**: Ch.11 exercises → user-authored sentences applying chapter time patterns — *Ik ga naar de supermarkt om tien uur in de ochtend.* and *Ik praat met mijn opa om tien over half zes in de middag.* (5:40 PM).
- **v1.19.2**: Ch.11 exercises revised — ex21 prompt → *I buy groceries at supermarket at 10 o'clock in the morning* (answer: *Ik koop boodschappen in de supermarkt om tien uur in de ochtend.*); ex22 answer → *Ik spreek om twintig voor zes 's avonds met mijn opa.* (5:40 PM as "twenty to six in the evening", *spreken* + *'s avonds*).
- **v1.19.3**: Ch.11 ex22 answer → *Ik spreek om tien over half zes 's avonds met mijn opa.* — uses the idiomatic relative *tien over half zes* (10 past half six = 5:40) matching the chapter's "over half" pattern, instead of the literal *twintig voor zes*.
- **v1.20.0**: Chapter 12 — Seasons, Months & Days (seasons, months, holidays, weekdays/weekend, days of the week, sun/moon/thunder etymology hints, schedule sentences); 42 new phrases; **2 Exercises** (24 tasks total).
- **v1.20.1**: Ch.12 — reorder vocab/short phrases first, sentences last; rewrite exercises as unique combinations (*In de winter werk ik op vrijdag.*; *De zomervakantie is in augustus. Ik voetbal in het weekend.*).
- **v1.21.0**: Chapter 13 — Clothing (shirt/riem/broek/korte broek/pak/schoenen/jurk/rok/hakken/sokken/jas, *dragen* conjugation *Ik draag / Jij draagt / Zij draagt*, sizes *groot/klein/kort* + inflected *grote/kleine*, demonstratives *deze/die* + *zijn*, *Dat klopt.*, *Kleding*); 25 new phrases; **2 Exercises** (26 tasks total) — *Jij draagt een pak als jij morgenochtend naar kantoor gaat.* and *Haar sokken zijn kort, dus zij koopt sokken in de kledingafdeling van de supermarkt.*
- **v1.22.0**: Chapter 14 — The Body & Health (body parts, doctor, health vocabulary, healthy/unhealthy habits, illness sentences); 26 new phrases; **2 Exercises** (28 tasks total).
- **v1.22.1**: Ch.14 exercises → multi-chapter scenarios combining Ch.2/4/11/12/14 — *Mijn opa is verkouden. Wat is het probleem? Hij heeft hoofdpijn.* and *In de winter heeft mijn dochter buikpijn. Op maandagochtend spreek ik met de dokter.*
- **v1.22.2**: Ch.14 exercises → user-authored — *Mijn tante heeft sinds de ochtend buikpijn. Gisteravond at zij vet eten.* and *Ik word verkouden in de lente 's ochtends. Ik spreek met de dokter als ik niet gezond ben.*
- **v1.22.3**: Ch.14 exercises revised — *Mijn tante heeft sinds de ochtend buikpijn. Zij at vet eten.* and *Ik ben verkouden na het drinken van cola uit de supermarkt.*
- **v1.23.0**: Chapter 15 — Comparisons (*vergelijkingen*, size/beauty comparison patterns *kleiner/groter/mooier/lelijker dan*, *net zo … als*, *even … als*, superlative triples *groot/groter/grootst* and *mooi/mooier/mooist*, *prachtig*, *bijzonder*, Amsterdam/Amstelveen sentences, animal superlative chain, table/chair and man/woman equality); 25 new phrases; **2 Exercises** (30 tasks total).
- **v1.23.1**: Ch.15 exercises rewritten as integrative multi-chapter scenarios (not Ch.15 phrase copies) — *Op zaterdagavond draagt mijn moeder een jurk. De kleine jurk is net zo mooi als de blauwe auto.* (Ch.15 *net zo mooi als* + Ch.2/6/12/13) and *In de winter eet mijn opa ongezond eten. Is de supermarkt groter dan de bakkerij?* (Ch.15 *groter dan* + Ch.2/5/7/9/12/14). Added **Exercises** mandatory rule to CLAUDE.md Critical Rules — answers must combine vocab/grammar from chapters 1–N, never repeat the target chapter's phrases.
- **v1.23.2**: Ch.15 exercises → user-authored — *Op zaterdagavond gaat mijn moeder naar Utrecht. Utrecht is even mooi als Amsterdam.* and *In de winter eet mijn opa ongezond eten. Is het plezier groter dan de gezondheid?*
- **v1.24.0**: Chapter 16 — Daily Routines (*ochtendroutine/middagroutine/avondroutine*, routine verbs, time-of-day patterns, morning/afternoon/evening sentences); 29 new phrases; **2 Exercises** (32 tasks total). Fixed *in de morgen* → *in de ochtend*; numeric times → Dutch words (*acht uur*, *negen uur*, etc.).
- **v1.25.0**: Chapter 17 — Transport (*vervoer*, *nemen/reizen*, *per/van/naar*, *met de* travel patterns, vehicles, Dutch cities & Amsterdam landmarks); 36 new phrases; **2 Exercises** (34 tasks total). Added *Ik reis met de trein.*, *Ik reis met het vliegtuig naar Schiphol.*, *Ik ga met de fiets.*; exercises: summer bike trip to supermarket for *ijs en dranken*; father *moet sporten* in Utrecht so takes the car at *twintig over drie*.
- **v1.26.0**: Chapter 18 — Positives/Negatives (*positief/negatief*, *geen*/*niet*, positive/negative adjectives, *Hoe gaat het?* / *Het gaat goed* / *Het gaat niet goed*, statement pairs); 28 new phrases; **2 Exercises** (36 tasks total). Exercises: cold Amsterdam in winter / *niet blij*; uncle *niet beroemd*, no big house, *geen auto*.
- **v1.27.0**: Chapter 19 — Inside the House (*het huis*, rooms, living-room/kitchen/bedroom/bathroom vocabulary, welcome phrases, preposition sentences *naast/voor/op/achter/onder*); 36 new phrases; **2 Exercises** (38 tasks total). Exercises: lamp/raam/stoel/tafel in *grote witte huis*, *geen koelkast*; *onze keuken* klein en mooi with *kookplaat*, *wasbak*, *geen gordijnen*.
- **v1.28.0**: Chapter 20 — Weather (*het weer*, weather nouns/conditions, compass directions, *liggen*, regional & weekday forecasts); 34 new phrases. Chapter 21 — Emotions (*emoties*, *voelen*, emotion adjectives, reflexive conjugation, *Ik ben trots op jou*); 25 new phrases. Chapter 22 — Narration 1 (*Koffie verkeerd* café story); 13 new phrases. **6 Exercises** (44 tasks total).
- **v1.28.1**: Toolbar **+ Expand all** / **− Collapse all** buttons for all chapters and the Exercises section; shared `setSectionCollapsed()` helper.
- **v1.28.2**: Add **Exercise 3** and **Exercise 4** for every chapter (Ch.1–22) — 44 revision exercises; **88 tasks** total (4 per chapter).
- **v1.28.3**: Consistent exercise titles — all 88 tasks now use `Chapter N — Exercise M — Translate to Dutch:` format.
- **v1.28.4**: Ch.1 Exercise 3 → *Goedemorgen. Ik ben vierenveertig jaar oud en mijn woonplaats is in Hoofdorp.*
- **v1.29.0**: Add unnumbered **Quick Review** chapter above Chapter 1 (below Bookmarks) — 63 reference entries: English function words (conjunctions, prepositions, pronouns, quantifiers) with their Dutch equivalents and English-phonetic guides. Existing chapter numbers unchanged.

---

## Current Chapters (v1.29.0)

- Quick Review (unnumbered, above Chapter 1)
1. Introducing Yourself  
2. Family  
3. Describing People  
4. To Be & To Have  
5. Food, Meals & Ordering  
6. Adjectives  
7. Getting Groceries  
8. Restaurant  
9. Questions  
10. Counting  
11. Telling Time  
12. Seasons, Months & Days  
13. Clothing  
14. The Body & Health  
15. Comparisons  
16. Daily Routines  
17. Transport  
18. Positives/Negatives  
19. Inside the House  
20. Weather  
21. Emotions  
22. Narration 1
