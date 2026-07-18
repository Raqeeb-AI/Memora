import inquirer from "inquirer"; //takes control from user terminal window -- lists visual screen and captures the input.
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
import { installShellHook } from "./shellIntegration.js";

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
        pageSize: 15,
        choices: [
          { name: "Save a command", value: "save" },
          { name: "Find & run a command", value: "run" },
          { name: "List everything saved", value: "list" },
          { name: "Delete a command", value: "delete" },
          new inquirer.Separator(),
          { name: theme.muted("Check for updates"), value: "update" },
          { name: theme.muted("How to use"), value: "guide" },
          { name: theme.muted("Setup shell integration (Mac/Linux)"), value: "setup-shell" },
          new inquirer.Separator(),
          { name: theme.muted("Exit"), value: "exit" },
        ],
      },
    ]);

    console.log();
    switch (choice) {
      case "save":
        await addCommand();
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
      case "setup-shell":
        installShellHook();
        break;
      case "exit":
        console.log(theme.muted("\nSee you next time.\n"));
        exit = true;
        break;
    }
  }
}
