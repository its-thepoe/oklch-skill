#!/usr/bin/env node
/**
 * Install oklch-skill to ~/.cursor/skills/oklch (or CURSOR_SKILLS_DIR/oklch).
 * Run: npx oklch-skill
 */
const { cpSync, mkdirSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const { execSync } = require("node:child_process");

const SKILL_NAME = "oklch";
const home = process.env.HOME || process.env.USERPROFILE;
const baseDir = process.env.CURSOR_SKILLS_DIR || join(home, ".cursor", "skills");
const skillDir = join(baseDir, SKILL_NAME);

// When installed via npm/npx, skill source is at package root/skills/oklch
const pkgRoot = join(__dirname, "..");
const skillSrc = join(pkgRoot, "skills", SKILL_NAME);

if (!existsSync(skillSrc)) {
  console.error("oklch-skill: skill source not found (skills/oklch/)");
  process.exit(1);
}

mkdirSync(baseDir, { recursive: true });
mkdirSync(skillDir, { recursive: true });
cpSync(join(skillSrc, "SKILL.md"), join(skillDir, "SKILL.md"), { force: true });
if (existsSync(join(skillSrc, "package.json"))) {
  cpSync(join(skillSrc, "package.json"), join(skillDir, "package.json"), { force: true });
}
const scriptsDir = join(skillDir, "scripts");
mkdirSync(scriptsDir, { recursive: true });
if (existsSync(join(skillSrc, "scripts"))) {
  for (const name of ["convert.mjs", "find-colors.mjs", "build-conversion-table.mjs"]) {
    const f = join(skillSrc, "scripts", name);
    if (existsSync(f)) cpSync(f, join(scriptsDir, name), { force: true });
  }
}

try {
  execSync("npm install", { cwd: skillDir, stdio: "inherit" });
} catch (e) {
  console.error("oklch-skill: npm install in skill dir failed");
  process.exit(1);
}

console.log("Installed oklch-skill to", skillDir);
console.log("Use /oklch or /oklab in Cursor to convert colors.");
