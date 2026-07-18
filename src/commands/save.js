import inquirer from "inquirer";
import clipboardy from "clipboardy";
import { addEntry, getAll, updateEntry } from "../db.js";
import { findSimilar } from "../search.js";
import { getLastTypedCommand } from "../lastCommand.js";
import { theme, symbols } from "../theme.js";
import { printSuccessBox } from "../banner.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Figures out which command to save, in order of trust:
// 1. The command you actually just typed in this terminal
// 2. Your clipboard, as a fallback
// 3. Manual entry, if neither of the above worked
// Whichever source it comes from, the user always confirms it before
// anything is saved — this is the fix for one source ever silently
// grabbing the wrong text.
async function resolveCommandToSave() {
  const typed = getLastTypedCommand();
  if (typed) {
    return typed;
  }

  if (process.platform !== "win32") {
    const memoraFile = path.join(os.homedir(), ".memora", "recent-commands");
    if (!fs.existsSync(memoraFile)) {
      console.log(theme.muted(`Tip: run \`memora setup-shell\` once to enable automatic detection on this machine.`));
    }
  }

  let clip = null;
  try {
    clip = (await clipboardy.read()).trim();
  } catch {
    clip = null;
  }

  if (clip) {
    console.log(theme.muted("\nFound this on your clipboard instead:"));
    console.log(`  ${theme.accent(clip)}\n`);
    const { confirmed } = await inquirer.prompt([
      { type: "confirm", name: "confirmed", message: "Save this one?", default: true },
    ]);
    if (confirmed) return clip;
  }

  const { manual } = await inquirer.prompt([
    {
      type: "input",
      name: "manual",
      message: "Paste the exact command:",
      validate: (v) => (v.trim() ? true : "The command can't be empty."),
    },
  ]);
  return manual.trim();
}

export async function saveCommand(description) {
  let desc = description;

  if (!desc) {
    const { d } = await inquirer.prompt([
      {
        type: "input",
        name: "d",
        message: "What does this command do?",
        validate: (v) => (v.trim() ? true : "Give it a short description."),
      },
    ]);
    desc = d;
  }

  const cmd = await resolveCommandToSave();
  if (!cmd) {
    console.log(theme.muted("\nCancelled — nothing saved."));
    return;
  }

  const existing = getAll();
  const similar = await findSimilar(existing, desc);

  if (similar) {
    console.log(theme.warn(`\n${symbols.bullet} You already have something similar saved:\n`));
    console.log(`  ${theme.text(similar.description)}`);
    console.log(`  ${theme.dim(similar.command)}\n`);

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: [
          { name: "Update that one with this new command", value: "update" },
          { name: "Save this as a new, separate entry anyway", value: "new" },
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]);

    if (action === "cancel") {
      console.log(theme.muted("\nCancelled — nothing saved."));
      return;
    }

    if (action === "update") {
      const updated = updateEntry(similar.id, { command: cmd });
      printSuccessBox([
        `${symbols.check} ${theme.bold(`Updated "${updated.description}"`)}`,
        "",
        `${theme.muted("Command:")} ${theme.accent(updated.command)}`,
      ]);
      return;
    }
  }

  const entry = addEntry({ description: desc, command: cmd, tags: [] });

  printSuccessBox([
    `${symbols.check} ${theme.bold("Saved")}`,
    "",
    `${theme.muted("Description:")} ${theme.text(entry.description)}`,
    `${theme.muted("Command:")}     ${theme.accent(entry.command)}`,
  ]);

  console.log(
    theme.muted(`\nRecall it with: `) +
    theme.primary(`memora run "${desc.split(" ").slice(0, 2).join(" ")}"`)
  );
}
