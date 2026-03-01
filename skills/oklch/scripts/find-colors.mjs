#!/usr/bin/env node
/**
 * Find all color-like strings in files. Output: path\tlineNumber\tcolumn\tcolor (one per line).
 * Column is the 0-based character offset in the line (for last-to-first replacement order).
 * Usage: node find-colors.mjs [path1 path2 ...]  (default: .)
 * Piped to convert.mjs for batch convert; convert.mjs outputs path\tline\tcolumn\tconverted.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const NAMED =
  "(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)";
const HEX = "#(?:[0-9a-fA-F]{3}){1,2}|#(?:[0-9a-fA-F]{8})";
// Require at least one digit inside parens; reject code/docs: no { ' " or long word runs (e.g. "comma or space-separated")
const NUMERIC_PAREN = "(?=[^)]*\\d)[^)'\"{}]+";
const RGB = "rgba?\\s*\\(" + NUMERIC_PAREN + "\\)";
const HSL = "hsla?\\s*\\(" + NUMERIC_PAREN + "\\)";
const HWB = "hwb\\s*\\(" + NUMERIC_PAREN + "\\)";
const LAB = "\\blab\\s*\\(" + NUMERIC_PAREN + "\\)";
const LCH = "\\blch\\s*\\(" + NUMERIC_PAREN + "\\)";
// color(space id): require at least one digit after the space id so we don't match "color(display-p3 ...)" or "color(srgb ...)"
const COLOR_FN = "color\\s*\\(\\s*[\\w.-]+\\s+" + NUMERIC_PAREN + "\\)";
const OKLCH = "\\boklch\\s*\\(\\s*[\\d.-][^)]*\\)";
const OKLAB = "\\boklab\\s*\\(\\s*[\\d.-][^)]*\\)";

const COLOR_REGEX = new RegExp(
  `\\b(${NAMED})\\b|(${HEX})|(${RGB})|(${HSL})|(${HWB})|(${LAB})|(${LCH})|(${COLOR_FN})|(${OKLCH})|(${OKLAB})`,
  "gi"
);

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "out"]);
const EXT = /\.(css|scss|sass|less|js|ts|jsx|tsx|vue|html|astro|svg|md|json)$/i;

function* walk(root, base = "") {
  const dir = base ? join(root, base) : root;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const rel = base ? join(base, e.name) : e.name;
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      yield* walk(root, rel);
    } else if (e.isFile() && EXT.test(e.name)) {
      yield join(root, rel);
    }
  }
}

function findColorsInFile(absPath, root) {
  const path = root ? relative(root, absPath) : absPath;
  let content;
  try {
    content = readFileSync(absPath, "utf-8");
  } catch {
    return [];
  }
  const out = [];
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let m;
    COLOR_REGEX.lastIndex = 0;
    while ((m = COLOR_REGEX.exec(line)) !== null) {
      const color = m[0];
      // Skip placeholder docs like oklch(...) or oklab(...) that have no digits inside
      if (/^oklch\s*\(/i.test(color) || /^oklab\s*\(/i.test(color)) {
        if (!/\d/.test(color)) continue;
      }
      out.push({ path, lineNum: i + 1, column: m.index, color });
    }
  }
  return out;
}

const paths = process.argv.slice(2).filter((p) => !p.startsWith("-"));
const root = process.cwd();
const files = paths.length
  ? paths.flatMap((p) => {
      const full = join(root, p);
      let s;
      try {
        s = statSync(full);
      } catch {
        return [];
      }
      return s.isDirectory() ? [...walk(full)] : [full];
    })
  : [...walk(root)];

for (const absPath of files) {
  for (const { path, lineNum, column, color } of findColorsInFile(absPath, root)) {
    console.log(`${path}\t${lineNum}\t${column}\t${color}`);
  }
}
