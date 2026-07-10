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
    const termWidth = process.stdout.columns || 80;
    const available = Math.max(40, termWidth - 12);
    const maxDesc = Math.floor(available * 0.4);
    const maxCmd = Math.floor(available * 0.6);
    const truncate = (str, len) => str.length > len ? str.slice(0, Math.max(0, len - 3)) + "..." : str.padEnd(len);

    const cPrimary = theme.primary; // Neon/violet for box lines

    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: `${symbols.bullet} Pick a command to delete:`,
        loop: false,
        choices: [
          new inquirer.Separator(cPrimary(`┌─${"─".repeat(maxDesc)}─┬─${"─".repeat(maxCmd)}─┐`)),
          new inquirer.Separator(cPrimary(`│ `) + theme.muted("Description".padEnd(maxDesc)) + cPrimary(` │ `) + theme.muted("Command".padEnd(maxCmd)) + cPrimary(` │`)),
          new inquirer.Separator(cPrimary(`├─${"─".repeat(maxDesc)}─┼─${"─".repeat(maxCmd)}─┤`)),
          ...entries.map((e) => ({
            name: cPrimary(`│ `) + theme.text(truncate(e.description, maxDesc)) + cPrimary(` │ `) + theme.dim(truncate(e.command, maxCmd)) + cPrimary(` │`),
            value: e.id,
          })),
          new inquirer.Separator(cPrimary(`└─${"─".repeat(maxDesc)}─┴─${"─".repeat(maxCmd)}─┘`)),
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
