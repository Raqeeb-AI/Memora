# memora 🧠

A CLI that remembers your terminal commands by what they do, not how you typed them. 🚀

## The problem 😫

You spend 15 minutes solving a problem and land on a command like this:

```cmd
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F
```

It works. You move on. Three weeks later the same problem comes back, and you've completely forgotten this command exists. So you Google it again, or ask ChatGPT again, and rebuild something you already solved once. 🤦‍♂️

## Meet memora 👋

Instead of remembering commands, you remember what they do. Save one with a plain-English description. Later, describe what you're trying to do, and memora finds it, even if you don't remember your exact wording. ✨

## See the full workflow 🎬

```bash
$ for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F

$ memora save "kill process on port"
╭────────────────────────────────╮
│ ✓ Saved: kill process on port  │
╰────────────────────────────────╯
```

```bash
$ memora run "free up a port"

Found
kill process on port
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F

Run this now? (y/N)
```

"Kill process on port" and "free up a port" mean the same thing to you. They mean the same thing to memora too. 🤝

## Install 💻

```bash
npm install -g memora-cmd
```

## Quick start ⚡

```bash
memora save "restart docker"
memora run "restart docker"
memora list
```

## Command reference 📖

| Command | Purpose | Example |
|---|---|---|
| `memora` | Open an interactive arrow-key menu 🎮 | `memora` |
| `memora save "desc"` | Save the command you just ran 💾 | `memora save "restart docker"` |
| `memora run "desc"` | Find a command and run it 🏃 | `memora run "restart docker"` |
| `memora find "desc"` | Find a command without running it 🔍 | `memora find "restart docker"` |
| `memora add "desc" -- cmd` | Add a command manually ✍️ | `memora add "restart docker" -- docker compose restart` |
| `memora list` | Show everything you've saved 📋 | `memora list` |
| `memora delete [id]` | Delete a saved command 🗑️ | `memora delete H8Q7xxe3` |

## Why not just Ctrl+R? 🤔

Shell history only works if you remember a fragment of what you typed. memora works from what the command *does*, which is what you actually remember weeks later.

| | Ctrl+R 🕒 | memora 🧠 |
|---|---|---|
| Search by | exact text typed | what the command does |
| Works across machines | No ❌ | Yes ✅ |
| Works on Windows CMD | No ❌ | Yes ✅ |
| Add notes | No ❌ | Yes ✅ |

## Key features ⭐

- 🎯 Search by meaning, not exact syntax
- 🔌 Works fully offline after install
- 🖥️ Windows, macOS, and Linux
- 🔒 Nothing ever uploaded anywhere
- 🕹️ Interactive menu if you forget the commands
- ☁️ No account, no cloud, no subscription

## How it works ⚙️

memora saves each command next to your plain-English description. When you search, it compares meaning, not just spelling, so different phrasings of the same intent still find the right command. 🧩

## Privacy and offline support 🛡️

Everything runs on your machine. No API keys, no network calls once installed, no data collection. It stays that way whether you save 5 commands or 5,000. 🔒

## Where your data lives 📁

A single JSON file in your OS's standard config folder:

- **Windows:** `%APPDATA%\memora-cli-nodejs\config.json`
- **macOS:** `~/Library/Preferences/memora-cli-nodejs`
- **Linux:** `~/.config/memora-cli-nodejs`

## Built with 🛠️

Node.js · Commander · Inquirer · Transformers.js · Chalk & Boxen · Conf

## Contributing 🤝

Issues and PRs welcome. Keep additions simple and in line with "save it, find it, done."

## License 📜

MIT
