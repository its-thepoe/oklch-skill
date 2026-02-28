---
name: oklch
description: Converts any color format to OKLCH or OKLab. Use when the user types /oklch or /oklab, or wants to find and convert all colors in a file, a specific file, or the whole repo.
---

# Color to OKLCH / OKLab

## Triggers

- **/oklch** — Convert the given color(s) to OKLCH.
- **/oklab** — Convert the given color(s) to OKLab.
- **Convert all colors in repo** — Find every color in the workspace and convert to OKLCH or OKLab.
- **Convert all colors in this file** — Find every color in the current/specified file and convert (pass the file path to find-colors).

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

1. **Preview first:** Run the pipeline and present the results as a table (file, line, original → converted). Do **not** replace in files until the user explicitly confirms (e.g. "apply", "replace", "go ahead").
2. Run **find-colors** from the **workspace/project root** (so paths in the output are correct), then pipe to **convert** (run from the skill dir so culori is available):
   ```bash
   cd /path/to/project/root && node ~/.cursor/skills/oklch/scripts/find-colors.mjs [path1 path2 ...] | node ~/.cursor/skills/oklch/scripts/convert.mjs <oklch|oklab>
   ```
   - **Whole repo:** Omit paths (scans current directory recursively).
   - **Single file:** Pass the file path, e.g. `node .../find-colors.mjs src/styles.css`.
   With no paths, `find-colors.mjs` scans the current directory recursively (skips `node_modules`, `.git`, `dist`, `build`, etc.). It looks in `.css`, `.scss`, `.sass`, `.less`, `.js`, `.ts`, `.jsx`, `.tsx`, `.vue`, `.html`, `.astro`, `.svg`, `.md`, `.json`.
3. Output is `path\tlineNumber\tcolumn\tconvertedColor` (tab-separated). `column` is the 0-based character offset in the line; use it to sort replacements **last-to-first** (highest column first) so earlier replacements do not shift positions for later ones.
4. **To replace in files (only after user confirms):** For each line of output, open the file at `path`, go to line `lineNumber`, find the original color string at `column` (same as find-colors would have matched) and replace it with the `convertedColor`. When a line has multiple colors, process them in **descending column order** (rightmost first).

## Supported input formats

Hex (#rgb, #rrggbb, #rrggbbaa), rgb()/rgba(), hsl()/hsla() (comma or space-separated), hwb(), lab(), lch(), color(display-p3 ...), color(srgb ...), oklch(), oklab(), and CSS named colors. The script uses culori for parsing and conversion. Existing oklch() and oklab() values are **normalized** (reformatted to 2 decimals, standard alpha) when found.

## Errors

If a color cannot be parsed, the script prints an error for that color and exits with code 1. Report the failed color(s) to the user.
