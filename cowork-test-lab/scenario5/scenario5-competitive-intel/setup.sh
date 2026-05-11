#!/bin/bash
set -e
DIR="$HOME/Desktop/CoworkTestLab/Scenario5_CompetitiveIntel"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[ -d "$DIR" ] && { read -p "Exists. Recreate? (y/N): " c; [[ $c == [yY] ]] && rm -rf "$DIR" || exit 0; }

mkdir -p "$DIR/inputs" "$DIR/outputs"
cp "$SCRIPT_DIR/test_documents/"* "$DIR/inputs/"
echo "✅ Created: $DIR"
echo "   $(ls -1 "$DIR/inputs" | wc -l | tr -d ' ') files in inputs/"
