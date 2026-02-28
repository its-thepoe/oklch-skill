---
name: oklch
description: Converts any color format to OKLCH or OKLab. Use when the user types /oklch or /oklab.
---

# Color to OKLCH / OKLab

## Triggers

- **/oklch** — Convert the given color(s) to OKLCH.
- **/oklab** — Convert the given color(s) to OKLab.

## When the user says /oklch

1. Identify the color(s) they provided (hex, rgb(), hsl(), named, lab(), lch(), hwb(), etc.).
2. Run the converter script from this skill directory:
   ```bash
   cd ~/.cursor/skills/oklch && npm install && node scripts/convert.mjs oklch "<color1>" ["<color2>" ...]
   ```
   Pass each color as a separate argument, quoted if it contains spaces or special characters.
3. Output the result(s) in the form `oklch(L C H / A)` (one per line if multiple). Include the alpha value (e.g. `/ 1` for opaque).

## When the user says /oklab

1. Identify the color(s) they provided.
2. Run:
   ```bash
   cd ~/.cursor/skills/oklch && node scripts/convert.mjs oklab "<color1>" ["<color2>" ...]
   ```
   (Run `npm install` once in that directory if not already done.)
3. Output the result(s) as `oklab(L a b / A)`.

## Supported input formats

Hex (#rgb, #rrggbb, #rrggbbaa), rgb()/rgba(), hsl()/hsla(), hwb(), lab(), lch(), and CSS named colors. The script uses culori for parsing and conversion.

## Errors

If a color cannot be parsed, the script prints an error for that color and exits with code 1. Report the failed color(s) to the user.
