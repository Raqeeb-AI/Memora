import boxen from "boxen";
import { theme } from "./theme.js";

export const VERSION = "1.0.9";

import chalk from "chalk";

export function printBanner() {
  const logo = [
    "   ____ ___   ___    ____ ___   ____    _____  ____ _",
    "  / __ `__ \\ / _ \\  / __ `__ \\ / __ \\  / ___/ / __ `/",
    " / / / / / //  __/ / / / / / // /_/ / / /    / /_/ / ",
    "/_/ /_/ /_/ \\___/ /_/ /_/ /_/ \\____/ /_/     \\__,_/  "
  ];

  const gradientHex = ["#9C27B0", "#AB47BC", "#BA68C8", "#CE93D8"];

  console.log();
  logo.forEach((line, index) => {
    console.log("  " + chalk.hex(gradientHex[index]).bold(line));
  });
  console.log();

  const title = `${theme.primaryDim("CLI")}  ${theme.muted(`v${VERSION}`)}`;
  const tagline = theme.text("Save a command. Find it later by what it does, not what you typed.");
  const divider = theme.dim("·".repeat(72));

  const usage =
    `${theme.primary("memora save")} ${theme.dim('"what it does"')} ${theme.muted("— saves the last command")}\n` +
    `${theme.primary("memora run ")} ${theme.dim('"what it does"')} ${theme.muted("— finds & asks to run it")}`;

  console.log(
    boxen(`${title}\n${tagline}\n${divider}\n${usage}`, {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: { top: 0, bottom: 0, left: 1, right: 0 },
      borderStyle: "round",
      borderColor: "#D9B24C",
      dimBorder: true,
    })
  );
  console.log(theme.dim("   Built by Mohammed Abdul Raqeeb · linkedin.com/in/md-abdul-raqeeb-b85a1922a\n"));
}

export function printMiniHeader(text) {
  console.log(theme.primary(`\n${text}`));
  console.log(theme.dim("─".repeat(Math.min(text.length + 4, 60))));
}

export function printSuccessBox(lines) {
  console.log(
    boxen(lines.join("\n"), {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      borderStyle: "round",
      borderColor: "#3DDC97",
      dimBorder: true,
    })
  );
}
