# OKLCHanger!

![oklchanger](https://raw.githubusercontent.com/maliMirkec/oklchanger/5a2a93f680c0401ad0e3951b924c51a0635dcf4d/gfx/oklchanger.gif)

Convert any colors to oklch!

A Visual Studio Code extension that converts various color definitions in selected text to the OKLCH color format. This extension supports named colors, HEX, RGB, RGBA, HSL, HSLA, Lab, and LCH color models.

## Features

- **Supports Multiple Color Formats**: Converts color definitions from named colors, HEX, RGB, RGBA, HSL, HSLA, Lab, and LCH formats to **OKLCH**.
- **User Feedback**: Displays error messages for colors that cannot be converted.

## Usage

1. Select the color definitions you want to convert in your code. It can be the whole code block.
2. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
3. Type `OKLCHanger!` and select the command.
4. The converted colors will replace the original definitions in your selected text.

## Cursor skill (installable)

This repo includes a **Cursor skill** (Option B: skill + Node script) so you or others can convert any color to OKLCH or OKLab via **/oklch** and **/oklab** in Cursor.

### Install the skill

From the repo root:

```bash
./scripts/install-cursor-skill.sh
```

That copies the `skill/` folder to `~/.cursor/skills/oklch/` and runs `npm install` there. To use a custom skills directory:

```bash
CURSOR_SKILLS_DIR=/path/to/skills ./scripts/install-cursor-skill.sh
```

**Manual install:** Copy the contents of `skill/` to `~/.cursor/skills/oklch/`, then run `npm install` inside that folder.

### Usage in Cursor

- **/oklch** — convert given color(s) to OKLCH (e.g. `oklch(0.63 0.26 29.23 / 1)`).
- **/oklab** — convert given color(s) to OKLab.

Supports hex, rgb(), hsl(), named colors, lab(), lch(), hwb(). Requires Node and a one-time `npm install` in the skill directory.

---

## Regex Explanation

The extension uses a regex pattern to match the following color formats:

- Named colors (e.g., red, green, blue)
- HEX colors (e.g., #ff0000, #f00, #f00ff0ff)
- RGB/RGBA (e.g., rgb(255, 0, 0), rgba(255, 0, 0, 0.5))
- HSL/HSLA (e.g., hsl(0, 100%, 50%), hsla(0, 100%, 50%, 0.5))
- Lab and LCH colors (e.g., lab(53.2329, 80.1093, 67.2201), lch(53.23, 107.24, 0deg))
- HWB colors (e.g., hwb(0, 0%, 0%))
- CSS variable syntax (e.g., --color-named: red;)

## Development

To contribute to this project or modify it:

1. Make your changes to the code.
2. Test your changes by launching the extension in the Extension Development Host.

## License

This project is licensed under the MIT License. See the [LICENSE](https://raw.githubusercontent.com/maliMirkec/oklchanger/refs/heads/master/LICENSE.md) file for details.

## Acknowledgments

This extension uses the `colorjs.io` library for color conversions. For more information, visit the [colorjs.io](https://colorjs.io) website.

> Built with assistance of ChatGPT. ¯\(ツ)/¯
