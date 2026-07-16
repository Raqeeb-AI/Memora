#!/usr/bin/env node
import { Command } from "commander";
import { runInteractive } from "../src/interactive.js";
import { saveCommand } from "../src/commands/save.js";
import { runCommand } from "../src/commands/run.js";
import { listCommand } from "../src/commands/list.js";
import { deleteCommand } from "../src/commands/delete.js";
import { addCommand } from "../src/commands/add.js";
import { findCommand } from "../src/commands/find.js";
import { updateCommand } from "../src/commands/update.js";
import { guideCommand } from "../src/commands/guide.js";
import { printBanner, VERSION } from "../src/banner.js";
import { theme } from "../src/theme.js";

const program = new Command();

program
  .name("memora")
  .description("Never forget a command again.")
  .version(VERSION);

program
  .command("save [description]")
  .description('Save the command you just ran. Example: memora save "restart docker"')
  .action(async (description) => {
    await saveCommand(description);
  });

program
  .command("run [query]")
  .description('Find a saved command and run it. Example: memora run "port"')
  .action(async (query) => {
    await runCommand(query);
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
  .command("add [description]")
  .description(
    '(Advanced) Save a command by typing it directly. Example: memora add "convert mp4 to gif" -- ffmpeg -i in.mp4 out.gif\n' +
    "Prefer `memora save` for commands with pipes/symbols — this can break on those depending on your shell."
  )
  .allowUnknownOption(true)
  .action(async (description, _opts, cmd) => {
    // Everything after `--` is treated as the literal command to store.
    const commandParts = cmd.args.slice(description ? 1 : 0);
    await addCommand(description, commandParts);
  });

program
  .command("find [query]")
  .description("(Advanced) Search saved commands without the run prompt — just lists matches")
  .option("-c, --copy", "copy the top match to your clipboard")
  .action(async (query, opts) => {
    await findCommand(query, opts);
  });

program
  .command("update")
  .description("Check for and install the latest version")
  .action(async () => {
    await updateCommand();
  });

program
  .command("guide")
  .description("Show a compact reference table of every memora command")
  .action(() => {
    guideCommand();
  });

program
  .command("about")
  .description("Show the Memora banner")
  .action(() => {
    printBanner();
  });

// No subcommand at all -> friendly interactive menu
if (process.argv.length <= 2) {
  runInteractive();
} else {
  program.parseAsync(process.argv);
}
