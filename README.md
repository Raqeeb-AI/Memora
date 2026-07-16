# memora

**Remember terminal commands by what they do—not by how they're written.**

Ever spent 15 minutes finding a command... only to forget it a week later?

You finally solve a problem after searching through Stack Overflow, GitHub issues, blogs, and random forums.

Maybe it's a command like this:

```cmd
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F
```

It works.

You move on.

A few weeks later, the exact same problem comes back.

Now you're searching Google again...

not because the solution is hard—

but because you can't remember the command.

Sound familiar?

That's exactly why Memora exists.

## Meet Memora 👋

Instead of remembering how to write commands,

just remember what they do.

Save commands in plain English.

Later, search using plain English.

Memora finds the right command for you—even if you don't remember the exact words you originally used.

### A complete example

Imagine you finally found the command to kill whatever is using port 3000.

Run it as usual:
```cmd
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F
```

Now tell Memora what it does:
```bash
memora save "kill process on port"
```

That's it.

Weeks later...

Instead of Googling again...

just describe what you're trying to do.

```bash
memora run "free port 3000"
```
or
```bash
memora run "stop process using a port"
```
or
```bash
memora run "kill application on port"
```

Memora understands they all mean the same thing.

It finds your command and asks before running it.

## Why it's different

You don't remember commands. You remember what they do.

Nobody remembers:
```bash
docker system prune -af
```
They remember:
**"clean Docker."**

Nobody remembers:
```cmd
ipconfig /all
```
They remember:
**"show my network information."**

Nobody remembers:
```bash
git reset --soft HEAD~1
```
They remember:
**"undo my last commit."**

That's exactly how Memora searches.

## Install

```bash
npm install -g memora-cmd
```

## Commands

### Save a command
You just ran something useful?

Save it immediately.
```bash
memora save "restart docker"
```
Memora automatically grabs the last command you executed.

No copy. No paste. No retyping.

### Run a command
Forgot the syntax?

Describe what you want.
```bash
memora run "restart docker"
```
Memora finds the closest match, shows you the command, and asks before executing it.

### Find without running
Want to see the command first?
```bash
memora find "restart docker"
```
Perfect when you just want to copy it.

### Add manually
Already know the command?

Add it yourself.
```bash
memora add "restart docker" -- docker compose restart
```
Useful in scripts or when command history isn't available.

### View everything
```bash
memora list
```
Displays every saved command.

### Delete
```bash
memora delete
```
Choose one interactively.

or
```bash
memora delete H8Q7xxe3
```
Delete directly using its ID.

### Interactive mode
Don't remember the Memora commands either?

Just run:
```bash
memora
```
Navigate everything using arrow keys.

## How it works

How does Memora find similar commands?

Memora doesn't search for exact words. It searches for meaning.

For example, these searches all find the same saved command:
- network info
- network configuration
- show my IP
- internet details

Even though the wording is different, the intent is the same.

Memora uses a small language model running entirely on your own computer to understand those similarities.

No cloud.
No API keys.
No subscriptions.

After the first download, everything works completely offline.

## Why Memora?

✅ Search by meaning instead of exact syntax
✅ Works completely offline
✅ Runs on Windows, macOS and Linux
✅ Never uploads your commands
✅ Interactive terminal UI
✅ No cloud account required
✅ Stores everything locally

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
