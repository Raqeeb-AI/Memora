import Fuse from "fuse.js";
import inquirer from "inquirer";
import clipboardy from "clipboardy";
import { getAll, touchEntry } from "../db.js";
import { theme, symbols } from "../theme.js";
import { printMiniHeader } from "../banner.js";

export async function findCommand(query, opts = {}) {
  const entries = getAll();

  if (entries.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} You haven't saved anything yet.`));
    console.log(theme.muted(`Try: `) + theme.primary(`memora save "what it does" -- your command here`));
    return;
  }

  if (!query) {
    const { q } = await inquirer.prompt([
      {
        type: "input",
        name: "q",
        message: `${symbols.search}  What are you trying to remember?`,
      },
    ]);
    query = q;
  }

  const fuse = new Fuse(entries, {
    keys: ["description", "tags", "command"],
    threshold: 0.4,
    includeScore: true,
  });

  const results = query.trim() ? fuse.search(query) : entries.map((item) => ({ item }));

  if (results.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} Nothing matched "${query}".`));
    console.log(theme.muted("Try a shorter or different word."));
    return;
  }

  printMiniHeader(`${results.length} match${results.length > 1 ? "es" : ""} for "${query}"`);

  results.slice(0, 8).forEach(({ item }, i) => {
    console.log(
      `${theme.primary.bold(`${i + 1}.`)} ${theme.text(item.description)} ${
        item.tags?.length ? theme.dim(item.tags.map((t) => "#" + t).join(" ")) : ""
      }`
    );
    console.log(`   ${theme.accent(item.command)}\n`);
  });

  if (opts.copy && results[0]) {
    try {
      await clipboardy.write(results[0].item.command);
      touchEntry(results[0].item.id);
      console.log(theme.accent(`${symbols.check} Top match copied to clipboard.`));
    } catch {
      console.log(theme.muted("(Clipboard copy not available in this environment.)"));
    }
  }
}
