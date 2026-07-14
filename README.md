# memora

**Never forget a command again.**

You've solved this exact problem before. Somewhere in your shell history is the `ffmpeg` flag combo, the `docker` one-liner, the `netstat` incantation that took you 15 minutes to get right the first time — and you're about to spend another 15 minutes finding it again.

### The Problem
Developers frequently type long, complicated terminal commands that they might not use every day, but don't want to re-learn or search Google for next time. Standard shell history tools (like hitting `Ctrl+R`) require you to remember the exact syntax or text you typed, they are tied to a single machine, they randomly forget older commands, and they don't work smoothly natively on Windows CMD. You need a system that retrieves commands based on their *intent* and meaning, not just exact text matches.

### The Solution: Memora
Memora fixes this constraint: Save a command right after you run it with a plain-English description, then find and run it later just by describing what it does. Instead of trying to memorize flags, Memora remembers contexts.

```
# just ran a gnarly command:
$ memora save "kill process on a port"

Last command in this terminal:
  for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F

Save this one? (Y/n)
✓ Saved

# weeks later...
$ memora run "network info"
Found
network configuration
ipconfig /all

Run this now? (y/N)
```

No account. No cloud. No AI guessing. Just your own commands, searchable by intent — and no retyping commands with pipes or special characters through your terminal's argument parser.

---

## Why not just use shell history (Ctrl+R)?

Shell history search only works if you remember a fragment of what you *typed*. Memora searches by what the command *did* — which is what you actually remember six weeks later.

| | Ctrl+R history search | Memora |
|---|---|---|
| Search by | exact text you typed | what the command does |
| Survives across machines | No | Yes (portable JSON store) |
| Works on Windows CMD | No (no history file) | Yes |
| Add notes/tags | No | Yes |

## Install

```bash
npm install -g memora-cmd
```

## Usage

### Save a command

Right after you run something you'll want again:

```bash
memora save "convert mp4 to gif"
```

Memora shows you the last command it detected in your terminal and asks you to confirm before saving anything — so it never silently saves the wrong thing. If detection doesn't work on your setup, it falls back to manual entry, always with the same confirmation step.

If you save something worded like an existing entry, Memora will also ask whether you meant to update it or save a separate one — so your list doesn't fill up with near-duplicates.

### Find & run a command

```bash
memora run "gif"
```

- Shows you the full matching command
- Asks **"Run this now?"** before doing anything

If more than one saved command could match, you'll get a short list to pick from instead of Memora silently guessing — so a command you use constantly never accidentally shadows one you rarely need.

Memora is truly intelligent: it uses a lightweight local AI model to perform **semantic matching** instead of simple fuzzy text. This means genuinely different wording with zero shared vocabulary (e.g. "network info" vs "check my ip") will still match perfectly. Since the model is bundled and runs on your machine, it retains the fully offline, private-by-default design this tool is built around.

Ranking is relevance-first regardless: text match quality always wins. Usage frequency only breaks ties between two matches that are already equally relevant — it never overrides a clearly better match.

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

### Advanced: type a command directly

If you can't use terminal detection (e.g. scripting/CI), typed-save is still available:

```bash
memora add "convert mp4 to gif" -- ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" output.gif
```

Everything after `--` is stored exactly as-is. Symbols like `|` and `^` may need escaping depending on your shell — `memora save` avoids this entirely and is the recommended default.

There's also a plain search without the run-prompt: `memora find "gif"`.

## Where's my data stored?

Locally, in a JSON file in your OS's standard config directory — nothing leaves your machine:

- **Windows:** `%APPDATA%\memora-cli-nodejs\config.json`
- **macOS:** `~/Library/Preferences/memora-cli-nodejs`
- **Linux:** `~/.config/memora-cli-nodejs`

## Built with

Node.js · [Commander](https://github.com/tj/commander.js) · [Inquirer](https://github.com/SBoudrias/Inquirer.js) · [Transformers.js](https://github.com/xenova/transformers.js) (semantic search) · [Chalk](https://github.com/chalk/chalk) & [Boxen](https://github.com/sindresorhus/boxen) (terminal styling) · [Conf](https://github.com/sindresorhus/conf) (cross-platform storage)

## Contributing

Issues and PRs welcome. This is a small, focused tool — keep additions simple and in line with "save it, find it, done."

## License

MIT
