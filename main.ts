// main.ts — "Your AI Therapist's Diagnosis"
// make.fun bounty: u-motasimfuad-your-ai-therapist-s-diagnosis-4be14a41
//
// Writes exactly one original one-line diagnosis from an AI therapist
// to <output-dir>/entry.txt (default output dir is /output, as the
// grader expects).
//
// Deterministic by construction: no network, no wall-clock, no randomness.
// Node 22, stdlib only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The diagnosis (chosen direction: acute notification anxiety — a calm,
// clinical finding built on two hard numbers and one named person, with
// the reversal landing on the very last words: the patient, not the
// phone, is the notification).
// Single line, no trailing newline in the entry file.
const DIAGNOSIS =
  "Diagnosis: acute notification anxiety. You checked your phone 214 times today, 38 of them during dinner with Maya. Verdict: the phone is fine. You are the notification.";

// Gate: the entry must be UTF-8 text of 1-200 characters, not only
// whitespace, and a single line (the bounty is one line, nothing else).
function validateEntry(text: string): void {
  const length = [...text].length; // code-point count, not UTF-16 units
  if (length < 1 || length > 200) {
    throw new Error(`entry length ${length} is outside the 1-200 gate`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  // Optional first argument overrides the output directory (used for
  // local verification runs); the grader runs with no argument and
  // gets /output/entry.txt.
  const outDir = process.argv[2] ?? "/output";
  const outPath = join(outDir, "entry.txt");

  // Validate before writing: nothing invalid ever reaches the file.
  validateEntry(DIAGNOSIS);

  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the gate counts the whole file content, so the
  // file is exactly the diagnosis and nothing else.
  writeFileSync(outPath, DIAGNOSIS, "utf8");

  // Read-back self-check: what is on disk must be byte-identical to
  // the validated diagnosis, and must still pass the gate.
  const back = readFileSync(outPath, "utf8");
  if (back !== DIAGNOSIS) {
    throw new Error("read-back mismatch: entry.txt differs from the diagnosis");
  }
  validateEntry(back);

  console.log(`wrote ${outPath} (${[...DIAGNOSIS].length} chars)`);
}

main();
