import inquirer from "inquirer";
import { spawnSync } from "node:child_process";
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
      { type: "input", name: "q", message: "What are you trying to do?" },
    ]);
    query = q;
  }

  const ranked = await rankMatches(entries, query);

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
    const { pick } = await inquirer.prompt([
      {
        type: "list",
        name: "pick",
        message: "Found a few close matches — which one did you mean?",
        choices: candidates.map((c) => ({
          name: `${c.item.description}  ${theme.dim(c.item.command)}`,
          value: c.item.id,
        })),
      },
    ]);
    chosen = entries.find((e) => e.id === pick);
  }

  printMiniHeader("Found");
  console.log(theme.text(chosen.description));
  console.log(theme.accent.bold(chosen.command) + "\n");

  const { run } = await inquirer.prompt([
    { type: "confirm", name: "run", message: "Run this now?", default: false },
  ]);

  touchEntry(chosen.id);

  if (!run) return;

  console.log(theme.muted(`\n${symbols.arrow} Running...\n`));

  const result = spawnSync(chosen.command, { shell: true, stdio: "inherit" });

  if (result.error) {
    console.log(theme.danger(`\n${symbols.cross} Failed to run command: ${result.error.message}`));
  } else if (result.status !== 0) {
    console.log(theme.danger(`\n${symbols.cross} Command exited with code ${result.status}.`));
  }
}
