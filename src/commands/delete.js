import inquirer from "inquirer";
import { getAll, removeEntry } from "../db.js";
import { theme, symbols } from "../theme.js";

export async function deleteCommand(id) {
  const entries = getAll();

  if (entries.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} Nothing to delete.`));
    return;
  }

  if (!id) {
    const maxDesc = Math.min(30, Math.max(...entries.map((e) => e.description.length)));
    const maxCmd = Math.min(45, Math.max(...entries.map((e) => e.command.length)));
    const truncate = (str, len) => str.length > len ? str.slice(0, len - 3) + "..." : str.padEnd(len);

    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: `${symbols.bullet} Pick a command to delete:`,
        loop: false,
        choices: [
          new inquirer.Separator(`  ┌─${"─".repeat(maxDesc)}─┬─${"─".repeat(maxCmd)}─┐`),
          new inquirer.Separator(`  │ ${theme.muted("Description".padEnd(maxDesc))} │ ${theme.muted("Command".padEnd(maxCmd))} │`),
          new inquirer.Separator(`  ├─${"─".repeat(maxDesc)}─┼─${"─".repeat(maxCmd)}─┤`),
          ...entries.map((e) => ({
            name: `│ ${truncate(e.description, maxDesc)} │ ${theme.dim(truncate(e.command, maxCmd))} │`,
            value: e.id,
          })),
          new inquirer.Separator(`  └─${"─".repeat(maxDesc)}─┴─${"─".repeat(maxCmd)}─┘`),
        ],
      },
    ]);
    id = choice;
  }

  const ok = removeEntry(id);
  if (ok) {
    console.log(theme.accent(`\n${symbols.check} Deleted.`));
  } else {
    console.log(theme.danger(`\n${symbols.cross} No entry found with id "${id}".`));
  }
}
