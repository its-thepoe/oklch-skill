<p align="center">
  <img src="https://img.shields.io/npm/v/oklch-skill?style=for-the-badge" alt="npm version" />
  <img src="https://img.shields.io/npm/l/oklch-skill?style=for-the-badge" alt="license" />
</p>

<h1 align="center">oklch-skill</h1>

<p align="center">
  <strong>Convert any color to OKLCH or OKLab</strong> — a Cursor & Claude Code skill
</p>

<p align="center">
  Use <code>/oklch</code> or <code>/oklab</code> to convert colors on the fly, or scan your entire repo and replace in one go.
</p>

---

## Features

| Command | What it does |
|---------|--------------|
| **/oklch** | Convert color(s) to OKLCH (e.g. `oklch(0.63 0.26 29.23 / 1)`) |
| **/oklab** | Convert color(s) to OKLab (perceptually uniform, great for gradients) |
| **Convert all** | Scan the whole repo → preview table → say "apply" to replace |

**Supported formats:** hex, rgb/rgba, hsl/hsla, hwb, lab, lch, `color(display-p3 ...)`, `color(srgb ...)`, oklch/oklab (normalized), and CSS named colors.

---

## Quick install

```bash
npx oklch-skill
```

Installs to `~/.cursor/skills/oklch/` and runs `npm install` there. Use `CURSOR_SKILLS_DIR=/path/to/skills` for a custom location.

---

## Install options

### npm (recommended)

```bash
npx oklch-skill
```

### Skills CLI (Cursor / Claude Code)

**Cursor:**
```bash
npx skills add its-thepoe/oklch-skill --skill oklch -g -a cursor -y
cd ~/.cursor/skills/oklch && npm install
```

**Claude Code:**
```bash
npx skills add its-thepoe/oklch-skill --skill oklch -g -a claude-code -y
```
Then run `npm install` in the skill directory the CLI reports.

### From clone

```bash
git clone https://github.com/its-thepoe/oklch-skill.git /tmp/oklch-skill
/tmp/oklch-skill/scripts/install-cursor-skill.sh
```

Or if you already have the repo:
```bash
./scripts/install-cursor-skill.sh
```

### Manual

Copy `skills/oklch/` to `~/.cursor/skills/oklch/`, then run `npm install` in that folder.

---

## Usage

- **/oklch** `#f00` or **/oklab** `rgb(0,0,255)` — convert one or more colors
- *"Convert all colors in this repo to OKLCH"* — preview table, then say **apply** to replace
- *"Convert all colors in `src/styles.css`"* — same flow for a single file

> Requires Node and a one-time `npm install` in the skill directory.

---

## Repo layout

| Path | Purpose |
|------|---------|
| `skills/oklch/` | Skill: SKILL.md, scripts, package.json |
| `bin/install.js` | Installer for `npx oklch-skill` |
| `scripts/install-cursor-skill.sh` | Install script |
| `scripts/test-skill-converter.mjs` | Smoke test (`npm run test:skill`) |

---

## Development

1. Edit the skill in `skills/oklch/`
2. Re-run `./scripts/install-cursor-skill.sh` to update
3. Run `npm run test:skill` to verify

---

## License

MIT · [LICENSE.md](LICENSE.md)

## Credits

Color parsing and conversion: [culori](https://github.com/nickel-org/culori)

---

<p align="center">
  <strong>Oladipupo Ayoola</strong> · <a href="https://thepoe.xyz">thepoe.xyz</a> · <a href="mailto:hi@thepoe.xyz">hi@thepoe.xyz</a>
</p>
