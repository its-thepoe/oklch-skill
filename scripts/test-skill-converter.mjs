/**
 * Smoke test for the Cursor skill converter (~/.cursor/skills/oklch/scripts/convert.mjs).
 * Run from repo root: node scripts/test-skill-converter.mjs
 * Requires the oklch skill to be installed and npm install already run in the skill dir.
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const home = process.env.HOME || process.env.USERPROFILE;
const skillScript = join(home, ".cursor", "skills", "oklch", "scripts", "convert.mjs");

if (!existsSync(skillScript)) {
  console.error("Skill script not found at", skillScript);
  process.exit(1);
}

function run(format, ...colors) {
  const args = [format, ...colors].map((a) => JSON.stringify(a));
  return execSync(`node "${skillScript}" ${args.join(" ")}`, {
    encoding: "utf-8",
    maxBuffer: 4096,
  }).trim();
}

let failed = 0;

// OKLCH: red -> has L, C, H and / 1
const oklchOut = run("oklch", "#f00");
if (!/^oklch\([\d.\s]+\/ 1\)$/.test(oklchOut)) {
  console.error("FAIL oklch #f00: expected oklch(L C H / 1), got:", oklchOut);
  failed++;
} else {
  console.log("OK  oklch #f00 ->", oklchOut);
}

// OKLab: blue
const oklabOut = run("oklab", "rgb(0,0,255)");
if (!/^oklab\([\d.\s-]+\/ 1\)$/.test(oklabOut)) {
  console.error("FAIL oklab rgb(0,0,255): expected oklab(L a b / 1), got:", oklabOut);
  failed++;
} else {
  console.log("OK  oklab rgb(0,0,255) ->", oklabOut);
}

// Invalid color -> exit 1
try {
  execSync(`node "${skillScript}" oklch "notacolor"`, { encoding: "utf-8", stdio: "pipe" });
  console.error("FAIL invalid color should exit 1");
  failed++;
} catch (err) {
  if (err.status !== 1) throw err;
  console.log("OK  invalid color -> exit 1");
}

if (failed > 0) {
  process.exit(1);
}
console.log("All tests passed.");
