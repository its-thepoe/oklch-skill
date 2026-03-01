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
2. **If they provided no color:** Treat as "convert all colors in the repo". From the **workspace root**, run the conversion-table script. It scans the whole repository and prints a markdown table (file | line | original → OKLCH). Do not replace in files until they say "apply".
   ```bash
   cd <workspace-root> && node ~/.cursor/skills/oklch/scripts/build-conversion-table.mjs oklch
   ```
   Use the script output as the conversion table. Optional: pass paths to limit scope, e.g. `node .../build-conversion-table.mjs oklch src`.

## When the user says /oklab

1. **If they provided color(s):** Run `node ~/.cursor/skills/oklch/scripts/convert.mjs oklab "<color1>" ...` and output each as `oklab(L a b / A)`.
2. **If they provided no color:** Same as /oklch with no color: run from workspace root: `node ~/.cursor/skills/oklch/scripts/build-conversion-table.mjs oklab`. Use the printed table (file | line | original → OKLab). Do not replace until they say "apply".

## When the user wants all colors in a file or repo converted

1. **Preview first:** Run the conversion-table script from the workspace root and present the printed table. Do **not** replace in files until the user explicitly confirms (e.g. "apply", "replace", "go ahead").
   ```bash
   cd <workspace-root> && node ~/.cursor/skills/oklch/scripts/build-conversion-table.mjs <oklch|oklab> [path1 path2 ...]
   ```
   - **Whole repo:** `build-conversion-table.mjs oklch` (or `oklab`) with no paths.
   - **Single file or dir:** e.g. `build-conversion-table.mjs oklch src styles.css`.
2. **To replace in files (only after user confirms):** Run find-colors, pipe to convert, then for each line of output (path\tline\tcolumn\tconverted), open the file, go to that line, find the original at that column and replace with the converted value. When a line has multiple colors, process in **descending column order** (rightmost first).
   ```bash
   cd <workspace-root> && node ~/.cursor/skills/oklch/scripts/find-colors.mjs [path1 ...] | node ~/.cursor/skills/oklch/scripts/convert.mjs <oklch|oklab>
   ```

## Supported input formats

Hex (#rgb, #rrggbb, #rrggbbaa), rgb()/rgba(), hsl()/hsla() (comma or space-separated), hwb(), lab(), lch(), color(display-p3 ...), color(srgb ...), oklch(), oklab(), and CSS named colors. The script uses culori for parsing and conversion. Existing oklch() and oklab() values are **normalized** (reformatted to 2 decimals, standard alpha) when found.

## Errors

If a color cannot be parsed, the script prints an error for that color and exits with code 1. Report the failed color(s) to the user.
