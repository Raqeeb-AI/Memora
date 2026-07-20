import boxen from "boxen";
import { theme } from "./theme.js";

export const VERSION = "1.0.18";

import chalk from "chalk";

export function printBanner() {
  const logo = [
    "  _ __ ___     ___   _ __ ___     ___    _ __    __ _ ",
    " | '_ ` _ \\   / _ \\ | '_ ` _ \\   / _ \\  | '__|  / _` |",
    " | | | | | | |  __/ | | | | | | | (_) | | |    | (_| |",
    " |_| |_| |_|  \\___| |_| |_| |_|  \\___/  |_|     \\__,_|"
  ];

  const gradientHex = ["#9C27B0", "#AB47BC", "#BA68C8", "#CE93D8"];

  console.log();
  logo.forEach((line, index) => {
    console.log("  " + chalk.hex(gradientHex[index]).bold(line));
  });
  console.log();

  const titleVisibleLen = 6 + 1 + 1 + VERSION.length;
  const titlePadding = " ".repeat(Math.floor((70 - titleVisibleLen) / 2));
  const title = titlePadding + `${theme.secondary("Memora")} ${theme.muted(`v${VERSION}`)}`;
  const saveCmd = theme.primary("memora save ");
  const runCmd = theme.primary("memora run  ");
  const argDesc = theme.dim('"description"');
  const dash = theme.muted("—");

  const line2 = `${saveCmd}${argDesc} ${dash} ${theme.text("Save terminal commands with plain-English.")}`;
  const line3 = `${runCmd}${argDesc} ${dash} ${theme.text("Search by meaning and run them instantly.")}`;
  const featuresText = "Offline • Private • Cross-platform";
  const padding = " ".repeat(18);
  const features = theme.secondary(padding + featuresText);

  console.log(
    boxen(`${title}\n${line2}\n${line3}\n${features}`, {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: { top: 0, bottom: 1, left: 1, right: 0 },
      borderStyle: "round",
      borderColor: "#D9B24C",
      dimBorder: true,
    })
  );
  console.log(theme.dim("   Developed by Mohammed Abdul Raqeeb\n"));
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
