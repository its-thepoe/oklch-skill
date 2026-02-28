#!/usr/bin/env sh
# Install the Cursor skill: copy skills/oklch (or skill/) to ~/.cursor/skills/oklch and npm install.
set -e
SKILL_DIR="${CURSOR_SKILLS_DIR:-$HOME/.cursor/skills}/oklch"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_SRC="$REPO_ROOT/skills/oklch"
if [ ! -d "$SKILL_SRC" ]; then
  SKILL_SRC="$REPO_ROOT/skill"
fi
if [ ! -d "$SKILL_SRC" ]; then
  echo "No skill source found (skills/oklch or skill/)"
  exit 1
fi

mkdir -p "$SKILL_DIR"
cp -R "$SKILL_SRC/"* "$SKILL_DIR/"
(cd "$SKILL_DIR" && npm install)
echo "Installed Cursor skill to $SKILL_DIR"
echo "Use /oklch or /oklab in Cursor to convert colors."
