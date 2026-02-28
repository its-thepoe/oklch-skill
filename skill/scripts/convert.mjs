#!/usr/bin/env node
/**
 * Convert color(s) to OKLCH or OKLab.
 * Usage:
 *   node convert.mjs <oklch|oklab> <color1> [color2 ...]
 *   node convert.mjs <oklch|oklab>   (read stdin: one color per line, or path\tline\tcolumn\tcolor for batch)
 * Example: node convert.mjs oklch "#f00" "rgb(0,0,255)"
 * Pipeline: node find-colors.mjs . | node convert.mjs oklch  (outputs path\tline\tcolumn\tconverted)
 */

import { createInterface } from "node:readline";
import * as culori from "culori";

function formatValue(value) {
  const formatted = Number(value).toFixed(2).replace(/\.00$/, "");
  return formatted === "-0" ? "0" : formatted;
}

function parseColor(colorStr) {
  let rgba = culori.parse(colorStr);

  if (!rgba) {
    const labMatch = colorStr.match(
      /lab\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/i
    );
    const lchMatch = colorStr.match(
      /lch\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)deg\s*\)/i
    );
    const hwbMatch = colorStr.match(
      /hwb\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/i
    );

    if (labMatch) {
      const l = parseFloat(labMatch[1]);
      const a = parseFloat(labMatch[2]);
      const b = parseFloat(labMatch[3]);
      rgba = culori.rgb({ mode: "lab", l, a, b });
    } else if (lchMatch) {
      const l = parseFloat(lchMatch[1]);
      const c = parseFloat(lchMatch[2]);
      const h = parseFloat(lchMatch[3]);
      rgba = culori.rgb({ mode: "lch", l, c, h });
    } else if (hwbMatch) {
      const h = parseFloat(hwbMatch[1]);
      const w = parseFloat(hwbMatch[2]);
      const b = parseFloat(hwbMatch[3]);
      rgba = culori.rgb({ mode: "hwb", h, w, b });
    } else {
      throw new Error(`Cannot parse color: ${colorStr}`);
    }
  }

  rgba.alpha = rgba.alpha ?? 1;
  return rgba;
}

function toOKLCH(rgba) {
  const oklch = culori.oklch(rgba);
  const alphaPart =
    rgba.alpha < 1 ? ` / ${formatValue(rgba.alpha)}` : " / 1";
  return `oklch(${formatValue(oklch.l ?? 0)} ${formatValue(oklch.c ?? 0)} ${formatValue(oklch.h ?? 0)}${alphaPart})`;
}

function toOKLab(rgba) {
  const oklab = culori.oklab(rgba);
  const alphaPart =
    rgba.alpha < 1 ? ` / ${formatValue(rgba.alpha)}` : " / 1";
  return `oklab(${formatValue(oklab.l ?? 0)} ${formatValue(oklab.a ?? 0)} ${formatValue(oklab.b ?? 0)}${alphaPart})`;
}

const format = process.argv[2]?.toLowerCase();
const colorStrings = process.argv.slice(3);

if (format !== "oklch" && format !== "oklab") {
  console.error("Usage: node convert.mjs <oklch|oklab> [color1 color2 ...]");
  process.exit(1);
}

const convert = format === "oklch" ? toOKLCH : toOKLab;
const errors = [];

async function runFromStdin() {
  const rl = createInterface({ input: process.stdin });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split("\t");
    let path, lineNum, column, colorStr;
    if (parts.length >= 4) {
      path = parts[0];
      lineNum = parts[1];
      column = parts[2];
      colorStr = parts.slice(3).join("\t");
    } else if (parts.length === 3) {
      path = parts[0];
      lineNum = parts[1];
      colorStr = parts[2];
    } else {
      colorStr = trimmed;
    }
    try {
      const rgba = parseColor(colorStr);
      const result = convert(rgba);
      if (parts.length >= 4) {
        console.log(`${path}\t${lineNum}\t${column}\t${result}`);
      } else if (parts.length === 3) {
        console.log(`${path}\t${lineNum}\t${result}`);
      } else {
        console.log(result);
      }
    } catch (err) {
      errors.push(colorStr);
      console.error(`Error: ${err.message}`);
    }
  }
  if (errors.length > 0) process.exit(1);
}

if (colorStrings.length > 0) {
  for (const colorStr of colorStrings) {
    try {
      const rgba = parseColor(colorStr);
      console.log(convert(rgba));
    } catch (err) {
      errors.push(colorStr);
      console.error(`Error: ${err.message}`);
    }
  }
  if (errors.length > 0) process.exit(1);
} else {
  runFromStdin();
}
