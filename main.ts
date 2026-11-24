import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: two lines explaining a toaster to a 10-year-old.
// Line 1: one vivid sentence, one analogy only — a toaster as a tiny
// sunbed where bread lies under glowing wires until it turns golden
// brown, then pops up on its timer. The timer detail matters: it is
// the part of the toaster a 10-year-old can hear and count on, and it
// sets up line 2's point that the bread never chooses when to stop.
// Line 2: one sentence on why the analogy works — heat browns bread
// the way sun browns skin — and what it leaves out: the heat comes
// from electric wires, not the sun, and the bread never chooses when
// to stop.
const LINE_1 =
  "A toaster is a tiny sunbed where a slice of bread lies under glowing wires until it turns golden brown, then pops up when its timer says so.";
const LINE_2 =
  "The sunbed fits because heat browns bread the way sun browns skin, but it leaves out that the heat comes from electric wires, not the sun, and the bread never chooses when to stop.";

const ENTRY = `${LINE_1}\n${LINE_2}`;

const MAX_CHARS = 400;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function checkEntry(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  const lines = text.split("\n");
  if (lines.length !== 2) {
    throw new Error(`entry must be exactly two lines, got ${lines.length}`);
  }
  for (const line of lines) {
    if (line.trim().length === 0) {
      throw new Error("each line must be non-empty");
    }
    if (line.trim() !== line) {
      throw new Error("lines must not have leading or trailing spaces");
    }
    // One sentence per line: exactly one sentence-ending full stop.
    const stops = (line.match(/\./g) ?? []).length;
    if (stops !== 1 || !line.endsWith(".")) {
      throw new Error("each line must be exactly one sentence ending in '.'");
    }
  }
}

function main(): void {
  checkEntry(ENTRY);
  // Create /output if needed; never delete the output directory itself,
  // only the known file this program writes.
  mkdirSync(OUT_DIR, { recursive: true });
  rmSync(OUT_FILE, { force: true });
  writeFileSync(OUT_FILE, ENTRY, "utf8");
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the entry");
  }
  if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("entry.txt bytes do not match the entry");
  }
  console.log(`${[...written].length} chars:\n${written}`);
}

main();
