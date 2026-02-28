#!/usr/bin/env sh
# Install the Cursor skill: copy skill/ to ~/.cursor/skills/oklch and npm install.
set -e
SKILL_DIR="${CURSOR_SKILLS_DIR:-$HOME/.cursor/skills}/oklch"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

mkdir -p "$SKILL_DIR"
cp -R "$REPO_ROOT/skill/"* "$SKILL_DIR/"
(cd "$SKILL_DIR" && npm install)
echo "Installed Cursor skill to $SKILL_DIR"
echo "Use /oklch or /oklab in Cursor to convert colors."
