# oklch-skill

A **Cursor & Claude Code skill** that converts any color format to OKLCH or OKLab. Use `/oklch` or `/oklab` in Cursor or Claude Code, or find and convert all colors in a file or the whole repo.

## What it does

- **/oklch** — Convert given color(s) to OKLCH (e.g. `oklch(0.63 0.26 29.23 / 1)`).
- **/oklab** — Convert given color(s) to OKLab.
- **Convert all in repo** — Find every color in the workspace and convert (preview first, then replace after you confirm).
- **Convert all in a file** — Pass a file path to limit the scan.

Supports hex, rgb/rgba, hsl/hsla (comma or space-separated), hwb, lab, lch, `color(display-p3 ...)`, `color(srgb ...)`, existing oklch/oklab (normalized), and CSS named colors.

## Install the skill

**Simplest (npm/npx)** — install directly with no clone. Once this package is published to npm:

```bash
npx oklch-skill
```

This installs the skill to `~/.cursor/skills/oklch/` and runs `npm install` there. Use `CURSOR_SKILLS_DIR=/path/to/skills npx oklch-skill` for a custom location.

**Using the skills CLI** — if you use [Vercel’s skills CLI](https://github.com/vercel-labs/skills) (works with Cursor, Claude Code, Codex, etc.):

**Cursor:**
```bash
npx skills add its-thepoe/oklch-skill --skill oklch -g -a cursor -y
cd ~/.cursor/skills/oklch && npm install
```

**Claude Code:** (install skill, then use `/oklch` or `/oklab` in Claude Code)
```bash
npx skills add its-thepoe/oklch-skill --skill oklch -g -a claude-code -y
```
Then run `npm install` in the skill directory the CLI reports (e.g. `~/.claude/skills/oklch` or similar), so the converter scripts work.

Replace `its-thepoe` with your fork’s org/username if needed. The second line (Cursor) installs the script dependency (culori) so `/oklch` and `/oklab` work.

**From a clone** — run in a terminal or ask your coding agent to run it:

```bash
git clone https://github.com/OWNER/oklch-skill.git /tmp/oklch-skill && /tmp/oklch-skill/scripts/install-cursor-skill.sh
```

**If you already have the repo:**

```bash
./scripts/install-cursor-skill.sh
```

**Manual:** Copy the contents of `skills/oklch/` to `~/.cursor/skills/oklch/`, then run `npm install` in that folder.

## Usage in Cursor or Claude Code

- **/oklch** `#f00` or **/oklab** `rgb(0,0,255)` — convert one or more colors you type.
- Ask to “convert all colors in this repo to OKLCH” — you get a preview table, then say “apply” to replace in files.
- Ask to “convert all colors in `src/styles.css`” — same flow for a single file.

Requires Node and a one-time `npm install` in the skill directory.

## Repo layout

| Path | Purpose |
|------|--------|
| `skills/oklch/` | Cursor skill: `SKILL.md`, `scripts/`, `package.json` (used by `npx skills add` and install scripts) |
| `bin/install.js` | Installer run by `npx oklch-skill` |
| `scripts/install-cursor-skill.sh` | Install script (copy skill + npm install) |
| `scripts/test-skill-converter.mjs` | Smoke test for the installed skill (`npm run test:skill`) |

## Development

- Edit the skill in `skills/oklch/`. Re-run `./scripts/install-cursor-skill.sh` to update your installed skill.
- Run `npm run test:skill` to verify the converter against the installed skill.

## License

MIT. See [LICENSE.md](LICENSE.md).

## Credits

Color parsing and conversion use [culori](https://github.com/nickel-org/culori).

## Author

**Oladipupo Ayoola** — [thepoe.xyz](https://thepoe.xyz) · [hi@thepoe.xyz](mailto:hi@thepoe.xyz)