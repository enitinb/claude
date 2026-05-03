#!/bin/sh
# Claude Code status line: model name + colored context-usage bar.
# Reads JSON from stdin (provided by Claude Code), prints one line to stdout.
#
# Customization:
#   WIDTH      - bar width in cells (default 10)
#   THRESH_MID - yellow threshold percent (default 50)
#   THRESH_HI  - red threshold percent    (default 80)

WIDTH=${WIDTH:-10}
THRESH_MID=${THRESH_MID:-50}
THRESH_HI=${THRESH_HI:-80}

input=$(cat)
model=$(echo "$input" | jq -r '.model.display_name // "Unknown Model"')
used=$(echo "$input" | jq -r '.context_window.used_percentage // empty')

if [ -z "$used" ]; then
  printf "%s" "$model"
  exit 0
fi

pct=$(printf "%.0f" "$used")
filled=$(( (pct * WIDTH + 50) / 100 ))
[ "$filled" -gt "$WIDTH" ] && filled=$WIDTH
[ "$filled" -lt 0 ] && filled=0
empty=$(( WIDTH - filled ))

if   [ "$pct" -ge "$THRESH_HI" ];  then color="\033[31m"
elif [ "$pct" -ge "$THRESH_MID" ]; then color="\033[33m"
else                                    color="\033[32m"
fi
reset="\033[0m"
dim="\033[2m"

bar=""; i=0
while [ "$i" -lt "$filled" ]; do bar="${bar}█"; i=$((i+1)); done
rest=""; i=0
while [ "$i" -lt "$empty" ];  do rest="${rest}░"; i=$((i+1)); done

printf "%s  ${dim}│${reset}  ${color}%s${reset}${dim}%s${reset} %3d%%" \
  "$model" "$bar" "$rest" "$pct"
