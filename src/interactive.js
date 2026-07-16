import inquirer from "inquirer";
import { printBanner } from "./banner.js";
import { theme } from "./theme.js";
import { saveCommand } from "./commands/save.js";
import { runCommand } from "./commands/run.js";
import { listCommand } from "./commands/list.js";
import { deleteCommand } from "./commands/delete.js";
import { addCommand } from "./commands/add.js";
import { findCommand } from "./commands/find.js";
import { updateCommand } from "./commands/update.js";
import { guideCommand } from "./commands/guide.js";

export async function runInteractive() {
  printBanner();

  let exit = false;
  while (!exit) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "What do you want to do?\n",
        loop: false,
        choices: [
          { name: "Save a command", value: "save" },
          { name: "Find & run a command", value: "run" },
          { name: "List everything saved", value: "list" },
          { name: "Delete a command", value: "delete" },
          new inquirer.Separator(),
          { name: theme.muted("Add a command manually"), value: "add" },
          { name: theme.muted("Find without running"), value: "find" },
          { name: theme.muted("Check for updates"), value: "update" },
          { name: theme.muted("How to use"), value: "guide" },
          new inquirer.Separator(),
          { name: theme.muted("Exit"), value: "exit" },
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
      case "list":
        listCommand();
        break;
      case "delete":
        await deleteCommand();
        break;
      case "add":
        await addCommand();
        break;
      case "find":
        await findCommand();
        break;
      case "update":
        await updateCommand();
        break;
      case "guide":
        guideCommand();
        break;
      case "exit":
        console.log(theme.muted("\nSee you next time.\n"));
        exit = true;
        break;
    }
  }
}
