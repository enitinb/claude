# claude-statusline

A minimal status line for [Claude Code](https://claude.com/claude-code) that shows your **model** and **context usage** as a colored bar.

```
Opus 4.7 (1M context)  │  ░░░░░░░░░░    2%   (green)
Opus 4.7 (1M context)  │  ███░░░░░░░   25%   (green)
Opus 4.7 (1M context)  │  ██████░░░░   55%   (yellow)
Opus 4.7 (1M context)  │  █████████░   85%   (red)
```

The percentage is read directly from the JSON Claude Code passes to status-line scripts (`context_window.used_percentage`) — it matches the value shown by `/context`.

## Requirements

- [Claude Code](https://claude.com/claude-code)
- `jq` — install with `brew install jq` (macOS) or `apt install jq` (Debian/Ubuntu)
- A modern terminal (truecolor / ANSI support — almost all of them)

## Install

Two copy-paste blocks. No JSON editing needed — `jq` handles the merge safely and preserves any existing settings.

### 1. Place the script

From inside this repo folder:

```sh
mkdir -p ~/.claude
cp statusline-command.sh ~/.claude/statusline-command.sh
chmod +x ~/.claude/statusline-command.sh
```

### 2. Wire it up in `settings.json`

```sh
# back up existing settings (safety net)
[ -f ~/.claude/settings.json ] && cp ~/.claude/settings.json ~/.claude/settings.json.bak

# merge the statusLine entry — handles both "file exists" and "file missing" cases
tmp=$(mktemp)
jq '. + {statusLine: {type: "command", command: "bash ~/.claude/statusline-command.sh"}}' \
  ~/.claude/settings.json 2>/dev/null > "$tmp" || \
  echo '{"statusLine":{"type":"command","command":"bash ~/.claude/statusline-command.sh"}}' | jq '.' > "$tmp"
mv "$tmp" ~/.claude/settings.json
```

What this does:
- Backs up your existing `settings.json` to `settings.json.bak`
- If `settings.json` exists, **merges** the `statusLine` key in — preserving every other setting you have
- If it doesn't exist, creates a new one with just the `statusLine` entry
- `jq` validates the JSON, so a typo can't produce a broken file

### 3. Restart Claude Code

Open a new session — the status line will appear at the bottom.

### Prefer to edit by hand?

Open `~/.claude/settings.json` and add this key (merging with whatever's already there):

```json
"statusLine": {
  "type": "command",
  "command": "bash ~/.claude/statusline-command.sh"
}
```

## Customize

The script reads a few environment variables. Set them inside the `command` string in `settings.json`:

| Variable | Default | Meaning |
|---|---|---|
| `WIDTH` | `10` | Number of cells in the bar |
| `THRESH_MID` | `50` | Percent at which color turns yellow |
| `THRESH_HI` | `80` | Percent at which color turns red |

Example — wider bar, more aggressive thresholds:

```json
{
  "statusLine": {
    "type": "command",
    "command": "WIDTH=20 THRESH_MID=40 THRESH_HI=70 bash ~/.claude/statusline-command.sh"
  }
}
```

## Uninstall

```sh
# remove the script
rm -f ~/.claude/statusline-command.sh

# strip the statusLine key out of settings.json
tmp=$(mktemp)
jq 'del(.statusLine)' ~/.claude/settings.json > "$tmp" && mv "$tmp" ~/.claude/settings.json
```

Then restart Claude Code.

## How it works

Claude Code pipes a JSON blob to the status-line script on every refresh. The script:

1. Reads `model.display_name` and `context_window.used_percentage` from stdin using `jq`
2. Renders a unicode bar — `█` for filled cells, `░` for empty
3. Picks a color (green / yellow / red) based on usage thresholds
4. Prints one line to stdout

That's the whole thing. ~30 lines of POSIX `sh`, no dependencies beyond `jq`.

## License

MIT — see [LICENSE](LICENSE).
