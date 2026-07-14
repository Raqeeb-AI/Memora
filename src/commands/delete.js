import inquirer from "inquirer";
import { getAll, removeEntry } from "../db.js";
import { theme, symbols } from "../theme.js";

export async function deleteCommand(id) {
  const entries = getAll();

  if (entries.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} Nothing to delete.`));
    return;
  }

  const termWidth = process.stdout.columns || 80;
  const maxDesc = Math.max(...entries.map((e) => e.description.length));
  const descLimit = Math.min(maxDesc, Math.floor(termWidth * 0.4));
  const cmdLimit = termWidth - descLimit - 12;

  if (!id) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: `${symbols.bullet} Pick a command to delete:`,
        loop: false,
        pageSize: 10,
        choices: entries.map((e) => {
          let d = e.description;
          if (d.length > descLimit) {
            d = d.slice(0, descLimit - 3) + "...";
          }
          d = d.padEnd(descLimit, " ");

          let c = e.command;
          if (c.length > cmdLimit && cmdLimit > 10) {
            c = c.slice(0, cmdLimit - 3) + "...";
          }

          return {
            name: `${d}  ${theme.dim("│")}  ${theme.dim(c)}`,
            value: e.id,
          };
        }),
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
