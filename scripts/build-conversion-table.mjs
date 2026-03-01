#!/usr/bin/env node
/**
 * Build conversion table: run find-colors, convert each color, output markdown table.
 * Usage: node build-table.mjs [oklch|oklab] [path1 path2 ...]
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const format = process.argv[2] || "oklch";
const paths = process.argv.slice(3);
const skillDir = join(process.env.HOME || process.env.USERPROFILE, ".cursor", "skills", "oklch", "scripts");
const findCmd = `node "${skillDir}/find-colors.mjs" ${paths.length ? paths.map((p) => `"${p}"`).join(" ") : "."}`;
const findOut = execSync(findCmd, { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
const lines = findOut.trim().split("\n").filter(Boolean);
const rows = [];

for (const raw of lines) {
  const idx1 = raw.indexOf("\t");
  const idx2 = raw.indexOf("\t", idx1 + 1);
  const idx3 = raw.indexOf("\t", idx2 + 1);
  if (idx3 === -1) continue;
  const file = raw.slice(0, idx1);
  const lineNum = raw.slice(idx1 + 1, idx2);
  const col = raw.slice(idx2 + 1, idx3);
  const original = raw.slice(idx3 + 1);
  let converted = "—";
  try {
    const out = execSync(`node "${skillDir}/convert.mjs" ${format} ${JSON.stringify(original)}`, {
      encoding: "utf8",
      maxBuffer: 4096,
    });
    converted = out.trim();
  } catch (_) {}
  rows.push({ file, line: lineNum, original, converted });
}

const max = 80;
const show = rows.length <= max ? rows : rows.slice(0, max);
console.log("| File | Line | Original | " + (format === "oklch" ? "OKLCH" : "OKLab") + " |");
console.log("|------|------|----------|-------|");
for (const r of show) {
  const orig = r.original.replace(/\|/g, "\\|").replace(/\n/g, " ");
  console.log(`| ${r.file} | ${r.line} | \`${orig}\` | ${r.converted} |`);
}
if (rows.length > max) {
  console.log(`| … | … | … | *( ${rows.length} total, showing first ${max} )* |`);
}
console.log("");
console.log("**Total:** " + rows.length + " color(s) found. Say **apply** to replace in files (rightmost first per line).");
