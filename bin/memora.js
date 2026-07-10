#!/usr/bin/env node
import { Command } from "commander";
import { runInteractive } from "../src/interactive.js";
import { saveCommand } from "../src/commands/save.js";
import { findCommand } from "../src/commands/find.js";
import { listCommand } from "../src/commands/list.js";
import { deleteCommand } from "../src/commands/delete.js";
import { grabCommand } from "../src/commands/grab.js";
import { goCommand } from "../src/commands/go.js";
import { printBanner } from "../src/banner.js";
import { theme } from "../src/theme.js";

const program = new Command();

program
  .name("memora")
  .description("Never forget a command again.")
  .version("1.0.2");

program
  .command("grab [description]")
  .description('Save the command currently on your clipboard. Example: memora grab "restart docker"')
  .action(async (description) => {
    await grabCommand(description);
  });

program
  .command("go [query]")
  .description('Find a saved command and run it. Example: memora go "port"')
  .action(async (query) => {
    await goCommand(query);
  });

program
  .command("save [description]")
  .description(
    '(Advanced) Save a command by typing it directly. Example: memora save "convert mp4 to gif" -- ffmpeg -i in.mp4 out.gif\n' +
    "Prefer `memora grab` for commands with pipes/symbols — this can break on those in CMD."
  )
  .allowUnknownOption(true)
  .action(async (description, _opts, cmd) => {
    // Everything after `--` is treated as the literal command to store.
    const commandParts = cmd.args.slice(description ? 1 : 0);
    await saveCommand(description, commandParts);
  });

program
  .command("find [query]")
  .description("(Advanced) Search saved commands without the run prompt \u2014 just lists matches")
  .option("-c, --copy", "copy the top match to your clipboard")
  .action(async (query, opts) => {
    await findCommand(query, opts);
  });

program
  .command("list")
  .alias("ls")
  .description("List every saved command")
  .action(() => {
    listCommand();
  });

program
  .command("delete [id]")
  .alias("rm")
  .description("Delete a saved command")
  .action(async (id) => {
    await deleteCommand(id);
  });

program
  .command("about")
  .description("Show the Memora banner")
  .action(() => {
    printBanner();
    console.log(theme.muted("A tiny CLI that remembers commands so you don't have to.\n"));
  });

// No subcommand at all -> friendly interactive menu (the "chat app" feel)
if (process.argv.length <= 2) {
  runInteractive();
} else {
  program.parseAsync(process.argv);
}
