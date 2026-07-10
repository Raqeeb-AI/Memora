# memora

**Never forget a command again.**

You've solved this exact problem before. Somewhere in your shell history is the `ffmpeg` flag combo, the `docker` one-liner, the `netstat` incantation that took you 15 minutes to get right the first time — and you're about to spend another 15 minutes finding it again.

Memora fixes that in two steps: copy a command, then find and run it later just by describing what it does.

```
# just ran a gnarly command, copy it, then:
$ memora save "kill process on a port"
✓ Saved

# weeks later...
$ memora run "port"
Found
kill process on a port
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F
Also copied to your clipboard.

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

Run your command, copy it (select + Ctrl+C), then:

```bash
memora save "convert mp4 to gif"
```

Memora reads the command straight from your clipboard — no retyping, and no fighting your shell's escaping rules for `|`, `^`, `%`, or quotes.

If you save something worded like an existing entry, Memora will ask whether you meant to update it or save a separate one — so your list doesn't fill up with near-duplicates.

### Find & run a command

```bash
memora run "gif"
```

- Shows you the full matching command
- Copies it to your clipboard automatically
- Asks **"Run this now?"** before doing anything

If more than one saved command could match, you'll get a short list to pick from instead of Memora silently guessing — so a command you use constantly never accidentally shadows one you rarely need.

Ranking is relevance-first: text match quality always wins. Usage frequency only breaks ties between two matches that are already equally relevant — it never overrides a clearly better match.

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

If you can't use the clipboard (e.g. scripting/CI), typed-save is still available:

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

Node.js · [Commander](https://github.com/tj/commander.js) · [Inquirer](https://github.com/SBoudrias/Inquirer.js) · [Fuse.js](https://fusejs.io/) (fuzzy search) · [Chalk](https://github.com/chalk/chalk) & [Boxen](https://github.com/sindresorhus/boxen) (terminal styling) · [Conf](https://github.com/sindresorhus/conf) (cross-platform storage)

## Contributing

Issues and PRs welcome. This is a small, focused tool — keep additions simple and in line with "save it, find it, done."

## License

MIT
