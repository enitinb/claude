#!/bin/bash
set -e
DIR="$HOME/Desktop/CoworkTestLab/Scenario4_OrganizeDownloads"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[ -d "$DIR" ] && { read -p "Exists. Recreate? (y/N): " c; [[ $c == [yY] ]] && rm -rf "$DIR" || exit 0; }

mkdir -p "$DIR/inputs" "$DIR/outputs"
cp "$SCRIPT_DIR/test_documents/"* "$DIR/inputs/"

# Stamp modification dates so date-based organization is testable.
# Format for touch -t: YYYYMMDDhhmm
cd "$DIR/inputs"
touch -t 202511081042 "Resume_AlexMorgan_v2.pdf"
touch -t 202602031533 "Resume_AlexMorgan_v3_FINAL.pdf"
touch -t 202602181102 "nordvale-invoice-INV-0042.pdf"
touch -t 202604030915 "meridian-quote-april2026.pdf"
touch -t 202601201410 "Halcyon-Labs-Whitepaper-2026.pdf"
touch -t 202603141821 "boarding-pass-SkyRail-MAR15.pdf"
touch -t 202603220910 "mortgage-statement-mar-2026.pdf"
touch -t 202602141422 "IMG_20260214_142233.jpg"
touch -t 202602141424 "IMG_20260214_142401.jpg"
touch -t 202603090911 "IMG_20260309_091122.jpg"
touch -t 202602140915 "Screenshot 2026-02-14 at 9.15.22 AM.png"
touch -t 202603021642 "Screenshot 2026-03-02 at 4.42.11 PM.png"
touch -t 202604181103 "Screenshot 2026-04-18 at 11.03.55 AM.png"
touch -t 202604061310 "q1-board-deck-draft.pptx"
touch -t 202601052108 "house-budget-2026.xlsx"
touch -t 202602192234 "cv-cover-letter-final-final.docx"
touch -t 202510120730 "recipes_to_try.txt"
touch -t 202603280812 "random_notes.txt"
touch -t 202604111947 "untitled.txt"
touch -t 202603121519 "zoom_recording_2026-03-12.mp4"
touch -t 202604021614 "tax_documents_2025.zip"
touch -t 202601241105 "installer_brightloom.dmg"

echo "✅ Created: $DIR"
echo "   $(ls -1 "$DIR/inputs" | wc -l | tr -d ' ') files in inputs/"
