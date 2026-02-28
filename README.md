# oklch-skill

A **Cursor skill** that converts any color format to OKLCH or OKLab. Use `/oklch` or `/oklab` in Cursor, or find and convert all colors in a file or the whole repo.

## What it does

- **/oklch** — Convert given color(s) to OKLCH (e.g. `oklch(0.63 0.26 29.23 / 1)`).
- **/oklab** — Convert given color(s) to OKLab.
- **Convert all in repo** — Find every color in the workspace and convert (preview first, then replace after you confirm).
- **Convert all in a file** — Pass a file path to limit the scan.

Supports hex, rgb/rgba, hsl/hsla (comma or space-separated), hwb, lab, lch, `color(display-p3 ...)`, `color(srgb ...)`, existing oklch/oklab (normalized), and CSS named colors.

## Install the skill

From the repo root:

```bash
./scripts/install-cursor-skill.sh
```

That copies the `skill/` folder to `~/.cursor/skills/oklch/` and runs `npm install` there. Custom skills directory:

```bash
CURSOR_SKILLS_DIR=/path/to/skills ./scripts/install-cursor-skill.sh
```

**Manual install:** Copy the contents of `skill/` to `~/.cursor/skills/oklch/`, then run `npm install` in that folder.

## Usage in Cursor

- **/oklch** `#f00` or **/oklab** `rgb(0,0,255)` — convert one or more colors you type.
- Ask to “convert all colors in this repo to OKLCH” — you get a preview table, then say “apply” to replace in files.
- Ask to “convert all colors in `src/styles.css`” — same flow for a single file.

Requires Node and a one-time `npm install` in the skill directory.

## Repo layout

| Path | Purpose |
|------|--------|
| `skill/` | Cursor skill: `SKILL.md`, `scripts/convert.mjs`, `scripts/find-colors.mjs`, `package.json` |
| `scripts/install-cursor-skill.sh` | Install script (copy skill + npm install) |
| `scripts/test-skill-converter.mjs` | Smoke test for the installed skill (`npm run test:skill`) |
| `src/` | Legacy VS Code extension source (oklchanger); kept for reference, not the main product |

## Development

- Edit the skill in `skill/` (SKILL.md and scripts).
- Re-run `./scripts/install-cursor-skill.sh` to update your installed skill.
- Run `npm run test:skill` to verify the converter against the installed skill.

## License

MIT. See [LICENSE.md](LICENSE.md).

## Credits

Color parsing and conversion use [culori](https://github.com/nickel-org/culori). The skill and scripts were derived from the original OKLCHanger VS Code extension logic.
