# Changelog

All notable changes to **oklch-skill** (this repo) are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2025-03-01

### Added

- Repo repurposed as **oklch-skill**: a Cursor skill (no longer the OKLCHanger VS Code extension as the main product).
- Cursor skill with triggers **/oklch** and **/oklab** for converting colors to OKLCH or OKLab.
- Scripts: `skills/oklch/scripts/convert.mjs` (culori-based converter), `skills/oklch/scripts/find-colors.mjs` (scan repo/files for color strings).
- Find-and-convert workflow: preview table, then replace in files after user confirms; supports whole repo or single file.
- Output includes `path`, `line`, `column` for last-to-first replacement order when multiple colors appear on one line.
- Support for modern CSS: `color(display-p3 ...)`, `color(srgb ...)`, space-separated rgb/hsl; existing `oklch()`/`oklab()` normalized.
- Install script `scripts/install-cursor-skill.sh` and smoke test `npm run test:skill`.

