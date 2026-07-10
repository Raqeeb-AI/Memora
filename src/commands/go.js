import inquirer from "inquirer";
import { exec } from "node:child_process";
import clipboardy from "clipboardy";
import { getAll, touchEntry } from "../db.js";
import { rankMatches } from "../search.js";
import { theme, symbols } from "../theme.js";
import { printMiniHeader } from "../banner.js";

const CANDIDATE_LIMIT = 5;

export async function goCommand(query) {
  const entries = getAll();

  if (entries.length === 0) {
    console.log(theme.warn(`\n${symbols.cross} You haven't saved anything yet.`));
    console.log(theme.muted(`Try: `) + theme.primary(`memora grab "what it does"`));
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
    const maxLen = Math.max(...candidates.map((c) => c.item.description.length));
    const { pick } = await inquirer.prompt([
      {
        type: "list",
        name: "pick",
        message: `${symbols.bullet} Found a few close matches — which one did you mean?`,
        loop: false,
        choices: candidates.map((c) => ({
          name: `${c.item.description.padEnd(maxLen + 2)} ${theme.dim(c.item.command)}`,
          value: c.item.id,
        })),
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
