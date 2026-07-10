import inquirer from "inquirer";
import { printBanner } from "./banner.js";
import { theme, symbols } from "./theme.js";
import { runCommand } from "./commands/run.js";
import { saveCommand } from "./commands/save.js";
import { addCommand } from "./commands/add.js";
import { findCommand } from "./commands/find.js";
import { listCommand } from "./commands/list.js";
import { deleteCommand } from "./commands/delete.js";

export async function runInteractive() {
  printBanner();

  let exit = false;
  while (!exit) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: theme.text("What do you want to do?"),
        loop: false,
        choices: [
          { name: `${symbols.save}  Save a command (copy it first, then pick this)`, value: "save" },
          { name: `${symbols.search}  Find & run a command`, value: "run" },
          { name: `${symbols.bullet} List everything saved`, value: "list" },
          { name: `${theme.danger("🗑")}  Delete a command`, value: "delete" },
          new inquirer.Separator(theme.muted("── advanced ──")),
          { name: `${theme.muted("Save by typing it directly")}`, value: "add" },
          { name: `${theme.muted("Search without running")}`, value: "find" },
          new inquirer.Separator(),
          { name: `${theme.muted("Exit Memora")}`, value: "exit" },
        ],
      },
    ]);

    console.log();
    switch (choice) {
      case "save":
        await saveCommand();
        break;
      case "run":
        await runCommand();
        break;
      case "add":
        await addCommand();
        break;
      case "find":
        await findCommand();
        break;
      case "list":
        listCommand();
        break;
      case "delete":
        await deleteCommand();
        break;
      case "exit":
        console.log(theme.primary(`${symbols.spark} See you next time.\n`));
        exit = true;
        break;
    }
  }
}
