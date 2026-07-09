import inquirer from "inquirer";
import { addEntry } from "../db.js";
import { theme, symbols } from "../theme.js";
import { printSuccessBox } from "../banner.js";

export async function saveCommand(description, commandParts) {
  let desc = description;
  let cmd = commandParts && commandParts.length ? commandParts.join(" ") : null;

  // Interactive fallback if called with no args (from the menu, or bare `memora save`)
  if (!desc || !cmd) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "description",
        message: `${symbols.brain}  What does this command do? (plain English)`,
        when: !desc,
        validate: (v) => (v.trim() ? true : "Give it a short description."),
      },
      {
        type: "input",
        name: "command",
        message: `${symbols.save}  Paste the exact command:`,
        when: !cmd,
        validate: (v) => (v.trim() ? true : "The command can't be empty."),
      },
      {
        type: "input",
        name: "tags",
        message: `${theme.muted("Optional tags (comma separated, or leave blank):")}`,
      },
    ]);
    desc = desc || answers.description;
    cmd = cmd || answers.command;
    var tagsInput = answers.tags;
  }

  const tags = tagsInput
    ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const entry = addEntry({ description: desc, command: cmd, tags });

  printSuccessBox([
    `${symbols.check} ${theme.bold("Saved!")}`,
    "",
    `${theme.muted("Description:")} ${theme.text(entry.description)}`,
    `${theme.muted("Command:")}     ${theme.accent(entry.command)}`,
    tags.length ? `${theme.muted("Tags:")}        ${tags.map((t) => theme.primary("#" + t)).join(" ")}` : null,
  ].filter(Boolean));

  console.log(theme.muted(`\nFind it later with: `) + theme.primary(`memora find "${desc.split(" ").slice(0, 2).join(" ")}"`));
}
