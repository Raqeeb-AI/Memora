import inquirer from "inquirer";
import { printBanner } from "./banner.js";
import { theme, symbols } from "./theme.js";
import { saveCommand } from "./commands/save.js";
import { findCommand } from "./commands/find.js";
import { listCommand } from "./commands/list.js";
import { deleteCommand } from "./commands/delete.js";
import { grabCommand } from "./commands/grab.js";
import { goCommand } from "./commands/go.js";

export async function runInteractive() {
  printBanner();

  let exit = false;
  while (!exit) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: theme.text("What do you want to do?"),
        choices: [
          { name: `${symbols.save}  Save a command (copy it first, then pick this)`, value: "grab" },
          { name: `${symbols.search}  Find & run a command`, value: "go" },
          { name: `${symbols.bullet} List everything saved`, value: "list" },
          { name: `${theme.danger("🗑")}  Delete a command`, value: "delete" },
          new inquirer.Separator(theme.muted("── advanced ──")),
          { name: `${theme.muted("Save by typing it directly")}`, value: "save" },
          { name: `${theme.muted("Search without running")}`, value: "find" },
          new inquirer.Separator(),
          { name: `${theme.muted("Exit Memora")}`, value: "exit" },
        ],
      },
    ]);

    console.log();
    switch (choice) {
      case "grab":
        await grabCommand();
        break;
      case "go":
        await goCommand();
        break;
      case "save":
        await saveCommand();
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
