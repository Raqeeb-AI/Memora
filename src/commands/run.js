import inquirer from "inquirer";
import { exec } from "node:child_process";
import clipboardy from "clipboardy";
import { getAll, touchEntry } from "../db.js";
import { rankMatches } from "../search.js";
import { theme, symbols } from "../theme.js";
import { printMiniHeader } from "../banner.js";

const CANDIDATE_LIMIT = 5;

export async function runCommand(query) {
  const entries = getAll();

  if (entries.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} You haven't saved anything yet.`));
    console.log(theme.muted(`Try: `) + theme.primary(`memora save "what it does"`));
    return;
  }

  if (!query) {
    const { q } = await inquirer.prompt([
      { type: "input", name: "q", message: `${symbols.search}  What are you trying to do?` },
    ]);
    query = q;
  }

  const ranked = rankMatches(entries, query);

  if (ranked.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} Nothing matched "${query}".`));
    console.log(theme.muted("Try a shorter or different word."));
    return;
  }

  let chosen;

  if (ranked.length === 1) {
    chosen = ranked[0].item;
  } else {
    // More than one plausible match: always let the user pick.
    // This is the safety net against usage-frequency (or fuzzy noise)
    // ever silently choosing the wrong command for you.
    const candidates = ranked.slice(0, CANDIDATE_LIMIT);
    const termWidth = process.stdout.columns || 80;
    const available = Math.max(40, termWidth - 12);
    let maxDesc = Math.max(11, ...candidates.map((c) => c.item.description.length));
    let maxCmd = Math.max(7, ...candidates.map((c) => c.item.command.length));

    if (maxDesc + maxCmd > available) {
      maxDesc = Math.min(maxDesc, Math.floor(available * 0.4));
      maxCmd = Math.min(maxCmd, Math.floor(available * 0.6));
    }

    const truncate = (str, len) => str.length > len ? str.slice(0, Math.max(0, len - 3)) + "..." : str.padEnd(len);

    const cPrimary = theme.primary;

    const { pick } = await inquirer.prompt([
      {
        type: "list",
        name: "pick",
        message: `${symbols.bullet} Found a few close matches — which one did you mean?`,
        loop: false,
        choices: [
          new inquirer.Separator(cPrimary(`┌─${"─".repeat(maxDesc)}─┬─${"─".repeat(maxCmd)}─┐`)),
          new inquirer.Separator(cPrimary(`│ `) + theme.muted("Description".padEnd(maxDesc)) + cPrimary(` │ `) + theme.muted("Command".padEnd(maxCmd)) + cPrimary(` │`)),
          new inquirer.Separator(cPrimary(`├─${"─".repeat(maxDesc)}─┼─${"─".repeat(maxCmd)}─┤`)),
          ...candidates.map((c) => ({
            name: cPrimary(`│ `) + theme.text(truncate(c.item.description, maxDesc)) + cPrimary(` │ `) + theme.dim(truncate(c.item.command, maxCmd)) + cPrimary(` │`),
            value: c.item.id,
          })),
          new inquirer.Separator(cPrimary(`└─${"─".repeat(maxDesc)}─┴─${"─".repeat(maxCmd)}─┘`)),
        ],
      },
    ]);
    chosen = entries.find((e) => e.id === pick);
  }

  printMiniHeader("Found it");
  console.log(theme.text(chosen.description));
  console.log(theme.accent.bold(chosen.command) + "\n");

  try {
    await clipboardy.write(chosen.command);
    console.log(theme.muted("(also on your clipboard, in case you want to edit before running)\n"));
  } catch {
    // clipboard not available in this environment — not fatal
  }

  const { run } = await inquirer.prompt([
    { type: "confirm", name: "run", message: "Run this now?", default: false },
  ]);

  touchEntry(chosen.id);

  if (!run) return;

  console.log(theme.muted(`\n${symbols.arrow} Running...\n`));

  exec(chosen.command, { shell: true }, (err, stdout, stderr) => {
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    if (err) {
      console.log(theme.danger(`\n${symbols.cross} Command exited with an error.`));
    }
  });
}
