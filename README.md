# 🧠 Memora

**Never forget a command again.**

You've solved this exact problem before. Somewhere in your shell history is the `ffmpeg` flag combo, the `docker` one-liner, the `netstat` incantation that took you 15 minutes to get right the first time — and you're about to spend another 15 minutes finding it again.

Memora fixes that. Save a command with a plain-English description. Find it later by describing what it does, not what you typed.

```
$ memora save "find what's running on a port" -- netstat -ano | findstr :8080
✔ Saved!

# weeks later...

$ memora find "port"
1. find what's running on a port
   netstat -ano | findstr :8080
```

No account. No cloud. No AI guessing. Just your own commands, searchable by intent.

---

## Why not just use shell history (Ctrl+R)?

Shell history search only works if you remember a fragment of what you *typed*. Memora searches by what the command *did* — which is what you actually remember six weeks later.

| | Ctrl+R history search | Memora |
|---|---|---|
| Search by | exact text you typed | what the command *does* |
| Survives across machines | ❌ | ✅ (portable JSON store) |
| Works on Windows CMD | ❌ (no history file) | ✅ |
| Add notes/tags | ❌ | ✅ |

## Install

```bash
npm install -g memora-cli
```

## Usage

### Save a command

```bash
memora save "convert mp4 to gif" -- ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" output.gif
```

Everything after `--` is stored exactly as-is — no parsing, no surprises.

### Find a command

```bash
memora find "gif"
```

Fuzzy search matches on description, tags, and the command itself — so you don't need the exact wording.

Copy the top match straight to your clipboard:

```bash
memora find "gif" --copy
```

### List everything you've saved

```bash
memora list
```

### Delete a command

```bash
memora delete
# or, if you know the id:
memora delete H8Q7xxe3
```

### Just run `memora`

No arguments launches a friendly interactive menu — pick what you want to do with arrow keys:

```bash
memora
```

## Where's my data stored?

Locally, in a JSON file in your OS's standard config directory — nothing leaves your machine:

- **Windows:** `%APPDATA%\memora-cli-nodejs\config.json`
- **macOS:** `~/Library/Preferences/memora-cli-nodejs`
- **Linux:** `~/.config/memora-cli-nodejs`

## Built with

Node.js · [Commander](https://github.com/tj/commander.js) · [Inquirer](https://github.com/SBoudrias/Inquirer.js) · [Fuse.js](https://fusejs.io/) (fuzzy search) · [Chalk](https://github.com/chalk/chalk) & [Boxen](https://github.com/sindresorhus/boxen) (terminal styling) · [Conf](https://github.com/sindresorhus/conf) (cross-platform storage)

## Contributing

Issues and PRs welcome. This is a small, focused tool — keep additions simple and in line with "save it, find it, done."

## License

MIT
