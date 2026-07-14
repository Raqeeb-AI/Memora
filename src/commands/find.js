import inquirer from "inquirer";
import { getAll, touchEntry } from "../db.js";
import { rankMatches } from "../search.js";
import { theme, symbols } from "../theme.js";
import { printMiniHeader } from "../banner.js";

export async function findCommand(query, opts = {}) {
  const entries = getAll();

  if (entries.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} You haven't saved anything yet.`));
    console.log(theme.muted(`Try: `) + theme.primary(`memora save "what it does"`));
    return;
  }

  if (!query) {
    const { q } = await inquirer.prompt([
      {
        type: "input",
        name: "q",
        message: "What are you trying to remember?",
      },
    ]);
    query = q;
  }

  const results = query.trim() ? await rankMatches(entries, query) : entries.map((item) => ({ item }));

  if (results.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} Nothing matched "${query}".`));
    console.log(theme.muted("Try a shorter or different word."));
    return;
  }

  printMiniHeader(`${results.length} match${results.length > 1 ? "es" : ""} for "${query}"`);

  results.slice(0, 8).forEach(({ item }, i) => {
    console.log(
      `${theme.primary.bold(`${i + 1}.`)} ${theme.text(item.description)} ${item.tags?.length ? theme.dim(item.tags.map((t) => "#" + t).join(" ")) : ""
      }`
    );
    console.log(`   ${theme.accent(item.command)}\n`);
  });
}
