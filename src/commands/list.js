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

  const termWidth = process.stdout.columns || 80;
  const idxWidth = String(entries.length).length + 1;

  const maxDesc = Math.max(...entries.map((e) => e.description.length));
  const maxCmd = Math.max(...entries.map((e) => e.command.length));

  const descLimit = Math.min(maxDesc, Math.floor(termWidth * 0.35));
  const cmdLimit = Math.min(maxCmd, Math.floor(termWidth * 0.40));

  entries.forEach((item, i) => {
    const num = `${i + 1}.`.padEnd(idxWidth, " ");

    let d = item.description;
    if (d.length > descLimit) {
      d = d.slice(0, descLimit - 3) + "...";
    }
    d = d.padEnd(descLimit, " ");

    let c = item.command;
    if (c.length > cmdLimit) {
      c = c.slice(0, cmdLimit - 3) + "...";
    }

    let tagsStr = item.tags?.length ? item.tags.map(t => "#" + t).join(" ") : "";

    if (tagsStr) {
      c = c.padEnd(cmdLimit, " ");
      const tagSpace = termWidth - idxWidth - descLimit - cmdLimit - 9;
      if (tagsStr.length > tagSpace && tagSpace > 5) {
        tagsStr = tagsStr.slice(0, tagSpace - 3) + "...";
      } else if (tagSpace <= 5) {
        tagsStr = "";
      }
    }

    const tagsPart = tagsStr ? `  ${theme.dim("│")}  ${theme.primary(tagsStr)}` : "";
    console.log(`${theme.primary.bold(num)}  ${theme.text(d)}  ${theme.dim("│")}  ${theme.accent(c)}${tagsPart}`);
  });
}
