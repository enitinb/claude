#!/bin/bash
set -e
DIR="$HOME/Desktop/CoworkTestLab/Scenario4_BatchRename"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[ -d "$DIR" ] && { read -p "Exists. Recreate? (y/N): " c; [[ $c == [yY] ]] && rm -rf "$DIR" || exit 0; }

mkdir -p "$DIR/inputs" "$DIR/outputs"
cp "$SCRIPT_DIR/test_documents/"* "$DIR/inputs/"

# Stamp modification dates so files without dates in their names
# (e.g., "photo (1).jpg") can still be sorted by mtime.
cd "$DIR/inputs"
touch -t 202603150920 "IMG_20260315_092042.jpg"
touch -t 202603151422 "IMG_20260315_142233.jpg"
touch -t 202603151718 "IMG_20260315_171814.jpg"
touch -t 202603151104 "Screenshot 2026-03-15 at 11.04.22 AM.png"
touch -t 202603160942 "Screenshot 2026-03-16 at 9.42.18 AM.png"
touch -t 202603150815 "photo (1).jpg"
touch -t 202603151310 "photo (2).jpg"
touch -t 202603161108 "photo (3).jpg"
touch -t 202603151018 "march15_keynote_panel.jpg"
touch -t 202603152031 "notes-march-15.txt"
touch -t 202603162145 "notes 3-16.txt"
touch -t 202604122108 "BoardPresentation-Final-v3-reviewed.pptx"

echo "✅ Created: $DIR"
echo "   $(ls -1 "$DIR/inputs" | wc -l | tr -d ' ') files in inputs/"
