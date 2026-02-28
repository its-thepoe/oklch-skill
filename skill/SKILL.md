---
name: oklch
description: Converts any color format to OKLCH or OKLab. Use when the user types /oklch or /oklab, or wants to find and convert all colors in a file or repo.
---

# Color to OKLCH / OKLab

## Triggers

- **/oklch** — Convert the given color(s) to OKLCH.
- **/oklab** — Convert the given color(s) to OKLab.
- **Convert all colors in repo/file** — Find every color in the workspace (or given paths) and convert to OKLCH or OKLab; optionally replace in place.

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

## When the user wants all colors in a file or repo converted

1. Run **find-colors** from the **workspace/project root** (so paths in the output are correct), then pipe to **convert** (run from the skill dir so culori is available):
   ```bash
   cd /path/to/project/root && node ~/.cursor/skills/oklch/scripts/find-colors.mjs [path1 path2 ...] | node ~/.cursor/skills/oklch/scripts/convert.mjs <oklch|oklab>
   ```
   With no paths, `find-colors.mjs` scans the current directory recursively (skips `node_modules`, `.git`, `dist`, `build`, etc.). It looks in `.css`, `.scss`, `.sass`, `.less`, `.js`, `.ts`, `.jsx`, `.tsx`, `.vue`, `.html`, `.astro`, `.svg`, `.md`, `.json`.
2. Output is `path\tlineNumber\tconvertedColor` (tab-separated), one line per occurrence. Paths are relative to the project root.
3. **To replace in files:** For each line of output, open the file at `path`, go to line `lineNumber`, find the original color string (same as find-colors would have matched) and replace it with the `convertedColor`. Apply all replacements so the repo is updated.
4. If the user only asked for a list (no in-place replace), present the results as a table or list: file, line, original → converted.

## Supported input formats

Hex (#rgb, #rrggbb, #rrggbbaa), rgb()/rgba(), hsl()/hsla(), hwb(), lab(), lch(), and CSS named colors. The script uses culori for parsing and conversion.

## Errors

If a color cannot be parsed, the script prints an error for that color and exits with code 1. Report the failed color(s) to the user.
