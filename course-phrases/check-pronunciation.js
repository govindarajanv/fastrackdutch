#!/usr/bin/env node
// Deterministic consistency checks for course-phrases/index.html's CHAPTERS data.
// Run after adding/editing phrases: node course-phrases/check-pronunciation.js
//
// This only catches MECHANICAL issues: bare numerals, multi-syllable words
// with no stress marker at all, and the same phrase transcribed two
// different ways. It does NOT verify phonetic accuracy, and it does NOT
// catch structural inconsistencies across parallel constructions (e.g. "these
// 5 greetings should share one stress pattern") — that needs an actual
// review pass by a human or an LLM. See course-phrases/CLAUDE.md.

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'index.html');
const html = fs.readFileSync(FILE, 'utf8');

const ENTRY_RE = /\{\s*dutch:\s*'((?:[^'\\]|\\.)*)',\s*pron:\s*'((?:[^'\\]|\\.)*)',\s*english:\s*'((?:[^'\\]|\\.)*)'\s*\}/g;
const entries = [];
let m;
while ((m = ENTRY_RE.exec(html))) {
  entries.push({ dutch: m[1], pron: m[2], english: m[3] });
}

if (!entries.length) {
  console.error('No CHAPTERS entries parsed — the regex may be stale vs index.html\'s current format.');
  process.exit(1);
}

let errors = 0;
const fail = msg => { console.log('FAIL: ' + msg); errors++; };
const stripPunct = s => s.replace(/^[.,?!:;"'()]+|[.,?!:;"'()]+$/g, '');

// 1. No empty fields
entries.forEach(e => {
  if (!e.dutch.trim() || !e.pron.trim() || !e.english.trim()) {
    fail(`Empty field in entry: ${JSON.stringify(e)}`);
  }
});

// 2. No bare numerals in pron (numbers must be spelled out phonetically)
entries.forEach(e => {
  if (/\d/.test(e.pron)) {
    fail(`Bare numeral in pron: "${e.dutch}" -> "${e.pron}"`);
  }
});

// 3. Every multi-syllable chunk (hyphenated) must mark a stressed syllable in CAPS
entries.forEach(e => {
  e.pron.split(/\s+/).forEach(raw => {
    const chunk = stripPunct(raw);
    if (chunk.includes('-') && !/[A-Z]/.test(chunk)) {
      fail(`Multi-syllable word with no CAPS stress marker: "${chunk}" in "${e.dutch}" -> "${e.pron}"`);
    }
  });
});

// 4. The same (or case-insensitively same) dutch phrase must not have two different pron spellings
const byPhrase = new Map(); // lowercase dutch -> Map(pron -> count)
entries.forEach(e => {
  const key = e.dutch.trim().toLowerCase();
  if (!byPhrase.has(key)) byPhrase.set(key, new Map());
  const variants = byPhrase.get(key);
  variants.set(e.pron, (variants.get(e.pron) || 0) + 1);
});
byPhrase.forEach((variants, key) => {
  if (variants.size > 1) {
    fail(`"${key}" transcribed ${variants.size} different ways: ${[...variants.keys()].map(v => `"${v}"`).join(' vs ')}`);
  }
});

console.log(`\nChecked ${entries.length} phrases. ${errors} mechanical issue(s) found.`);

// 5. Informational only (not a failure): common grammar words that show up with more
// than one spelling across different sentences. Alignment is a heuristic (whole-entry
// token soup, not true word-for-word alignment) so treat this as a hint to eyeball,
// not a verdict.
const TARGET_WORDS = ['ik', 'is', 'mijn', 'een', 'zijn', 'heeft', 'hebben', 'jij', 'hij', 'zij', 'wij', 'jullie', 'ben', 'bent', 'dit', 'dat', 'heb', 'hebt'];
const tokenCounts = {}; // dutch word -> Map(pron token lowercased -> count)
entries.forEach(e => {
  const dWords = e.dutch.toLowerCase().replace(/[.,?!]/g, '').split(/\s+/);
  const pTokens = e.pron.toLowerCase().replace(/[.,?!]/g, '').split(/[\s-]+/);
  dWords.forEach(dw => {
    if (!TARGET_WORDS.includes(dw)) return;
    tokenCounts[dw] = tokenCounts[dw] || new Map();
    pTokens.forEach(pt => tokenCounts[dw].set(pt, (tokenCounts[dw].get(pt) || 0) + 1));
  });
});
console.log('\n--- Review hint: grammar-word token frequency (top 5 each; eyeball for stray spellings) ---');
TARGET_WORDS.forEach(w => {
  if (!tokenCounts[w]) return;
  const top = [...tokenCounts[w].entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  console.log(w.padEnd(8), '=>', top.map(([t, c]) => `${t}(${c})`).join(', '));
});

process.exit(errors ? 1 : 0);
