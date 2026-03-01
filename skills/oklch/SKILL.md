---
name: oklch
description: Converts any color format to OKLCH or OKLab. Use when the user types /oklch or /oklab, or wants to find and convert all colors in a file, a specific file, or the whole repo.
---

# Color to OKLCH / OKLab

## Triggers

- **/oklch** — Convert the given color(s) to OKLCH. If **no color is provided**, scan the **whole repository** for colors, convert all to OKLCH, and present the results as a **conversion table** (file, line, original → converted). Do not replace in files until the user says "apply".
- **/oklab** — Same as /oklch but convert to OKLab. If no color is provided, scan the whole repo and show the conversion table.

## When the user says /oklch

1. **If they provided color(s):** Run the converter and output the result(s):
   ```bash
   cd ~/.cursor/skills/oklch && node scripts/convert.mjs oklch "<color1>" ["<color2>" ...]
   ```
   Output each result as `oklch(L C H / A)`.
2. **If they provided no color:** Treat as "convert all colors in the repo". Run the pipeline from the **workspace root**, then present a **conversion table** (file | line | original → converted). Do not replace in files until they say "apply".
   ```bash
   cd <workspace-root> && node ~/.cursor/skills/oklch/scripts/find-colors.mjs . | node ~/.cursor/skills/oklch/scripts/convert.mjs oklch
   ```
   Build a markdown table with columns: **File** | **Line** | **Original** | **OKLCH**. For each line of output (path\tline\tcolumn\tconverted), you have the converted value; the original color is what find-colors matched at that path/line/column (run find-colors separately to get path\tline\tcolumn\toriginal and align by line order to show original → converted).

## When the user says /oklab

1. **If they provided color(s):** Run `node ~/.cursor/skills/oklch/scripts/convert.mjs oklab "<color1>" ...` and output each as `oklab(L a b / A)`.
2. **If they provided no color:** Same as /oklch with no color: scan the whole repo, convert all to OKLab, present the conversion table (file | line | original → converted). Do not replace until they say "apply".

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
