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
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: `${symbols.bullet} Pick a command to delete:`,
        choices: entries.map((e) => ({
          name: `${e.description}  ${theme.dim(e.command)}`,
          value: e.id,
        })),
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
