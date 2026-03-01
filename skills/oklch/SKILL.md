---
name: oklch
description: Converts any color format to OKLCH or OKLab. One command: /oklch. Say "OKLab" or "gradients" (e.g. "convert all gradients to oklab") to get OKLab output; otherwise OKLCH. Scans whole repo when no color is given.
---

# Color to OKLCH / OKLab

## Trigger

- **/oklch** — Single command. User can ask for **OKLab** (e.g. "convert all gradients to oklab", "oklch oklab (gradient)", "use OKLab") or **OKLCH** (default). If **no color is provided**, scan the **whole repository**, convert all colors to the chosen format, and show a **conversion table** (file | line | original → converted). Do not replace in files until the user says "apply".

## Choosing OKLCH vs OKLab

- Use **OKLab** when the user says: OKLab, oklab, gradient(s), "convert all gradients to oklab", "oklch oklab (gradient)", or similar. OKLab is preferred for gradients (perceptually uniform blending).
- Use **OKLCH** otherwise (default).

## When the user uses /oklch

1. **Choose format** from their message (see above): `oklab` or `oklch`.
2. **If they provided color(s):** Run the converter in the chosen format:
   ```bash
   node ~/.cursor/skills/oklch/scripts/convert.mjs <oklch|oklab> "<color1>" ["<color2>" ...]
   ```
   Output as `oklch(L C H / A)` or `oklab(L a b / A)`.
3. **If they provided no color (or asked for "all" / "gradients" / repo scan):** From the **workspace root**, run the conversion-table script in the chosen format:
   ```bash
   cd <workspace-root> && node ~/.cursor/skills/oklch/scripts/build-conversion-table.mjs <oklch|oklab>
   ```
   Use the script output as the conversion table. Optional: pass paths to limit scope, e.g. `... build-conversion-table.mjs oklab src`.
   **Always include the full script output in your response**—paste the entire table (every row). Do not summarize, truncate, or use an ellipsis row; the user should see the complete list.

## Response format (important)

- **Conversion table:** When you run `build-conversion-table.mjs`, include the **full** script output in your reply. Paste every row of the table so the user sees the complete list. Do not cap or summarize (e.g. no "first 80" or "…" row).
- **Single-color conversion:** Output the exact result(s) from the converter script.
- **Apply:** Only replace in files after the user says "apply" (or "replace", "go ahead").

## When the user wants all colors in a file or repo converted

1. **Preview first:** Run the conversion-table script from the workspace root and present the **full** printed table (every row; do not truncate or summarize). Do **not** replace in files until the user explicitly confirms (e.g. "apply", "replace", "go ahead").
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
