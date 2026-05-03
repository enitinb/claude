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

### 1. Place the script

```sh
mkdir -p ~/.claude
cp statusline-command.sh ~/.claude/statusline-command.sh
chmod +x ~/.claude/statusline-command.sh
```

### 2. Tell Claude Code to use it

Open `~/.claude/settings.json` and add the `statusLine` key.

**If the file doesn't exist**, create it with this content:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  }
}
```

**If the file already exists**, merge the `statusLine` key into your existing JSON. Example before/after:

Before:
```json
{
  "theme": "dark"
}
```

After:
```json
{
  "theme": "dark",
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  }
}
```

### 3. Restart Claude Code

Open a new session — the status line will appear at the bottom.

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

1. Delete the script: `rm ~/.claude/statusline-command.sh`
2. Remove the `statusLine` key from `~/.claude/settings.json`
3. Restart Claude Code

## How it works

Claude Code pipes a JSON blob to the status-line script on every refresh. The script:

1. Reads `model.display_name` and `context_window.used_percentage` from stdin using `jq`
2. Renders a unicode bar — `█` for filled cells, `░` for empty
3. Picks a color (green / yellow / red) based on usage thresholds
4. Prints one line to stdout

That's the whole thing. ~30 lines of POSIX `sh`, no dependencies beyond `jq`.

## License

MIT — see [LICENSE](LICENSE).
