import { getAll } from "../db.js";
import { theme, symbols } from "../theme.js";
import { printMiniHeader } from "../banner.js";

export function listCommand() {
  const entries = getAll();

  if (entries.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} No saved commands yet.`));
    console.log(theme.muted(`Try: `) + theme.primary(`memora save "what it does" -- your command here`));
    return;
  }

  printMiniHeader(`${entries.length} saved command${entries.length > 1 ? "s" : ""}`);

  entries.forEach((item, i) => {
    console.log(
      `${theme.primary.bold(`${i + 1}.`)} ${theme.text(item.description)} ${theme.dim(`(${item.id})`)}`
    );
    console.log(`   ${theme.accent(item.command)}`);
    if (item.tags?.length) {
      console.log(`   ${item.tags.map((t) => theme.primary("#" + t)).join(" ")}`);
    }
    console.log();
  });
}
