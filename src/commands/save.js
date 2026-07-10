import inquirer from "inquirer";
import clipboardy from "clipboardy";
import { addEntry, getAll, updateEntry } from "../db.js";
import { findSimilar } from "../search.js";
import { theme, symbols } from "../theme.js";
import { printSuccessBox } from "../banner.js";

export async function saveCommand(description) {
  let desc = description;

  if (!desc) {
    const { d } = await inquirer.prompt([
      {
        type: "input",
        name: "d",
        message: `${symbols.brain}  What does this command do?`,
        validate: (v) => (v.trim() ? true : "Give it a short description."),
      },
    ]);
    desc = d;
  }

  let cmd;
  try {
    cmd = (await clipboardy.read()).trim();
  } catch {
    console.log(theme.danger(`\n${symbols.cross} Couldn't read your clipboard.`));
    console.log(
      theme.muted("Copy your command first (select it, then Ctrl+C), then run this again.")
    );
    return;
  }

  if (!cmd) {
    console.log(theme.warn(`\n${symbols.cross} Your clipboard is empty.`));
    console.log(theme.muted("Copy the command you want to save, then run this again."));
    return;
  }

  const existing = getAll();
  const similar = findSimilar(existing, desc);

  if (similar) {
    console.log(
      theme.warn(
        `\n${symbols.bullet} You already have something similar saved:\n`
      )
    );
    console.log(`   ${theme.text(similar.description)}`);
    console.log(`   ${theme.dim(similar.command)}\n`);

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
    `${symbols.check} ${theme.bold("Saved from clipboard!")}`,
    "",
    `${theme.muted("Description:")} ${theme.text(entry.description)}`,
    `${theme.muted("Command:")}     ${theme.accent(entry.command)}`,
  ]);

  console.log(
    theme.muted(`\nRecall it anytime with: `) +
    theme.primary(`memora run "${desc.split(" ").slice(0, 2).join(" ")}"`)
  );
}
