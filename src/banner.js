import boxen from "boxen";
import { theme } from "./theme.js";

export const VERSION = "1.0.7";

import chalk from "chalk";

export function printBanner() {
  const letters = {
    M: [
      "  __  __ ",
      " |  \\/  |",
      " | |\\/| |",
      " | |  | |",
      " |_|  |_|"
    ],
    e: [
      "       ",
      "  ___  ",
      " / _ \\ ",
      "|  __/ ",
      " \\___| "
    ],
    m: [
      "            ",
      " _ __ ___   ",
      "| '_ ` _ \\  ",
      "| | | | | | ",
      "|_| |_| |_| "
    ],
    o: [
      "       ",
      "  ___  ",
      " / _ \\ ",
      "| (_) |",
      " \\___/ "
    ],
    r: [
      "      ",
      " _ __ ",
      "| '__|",
      "| |   ",
      "|_|   "
    ],
    a: [
      "        ",
      "  __ _  ",
      " / _` | ",
      "| (_| | ",
      " \\__,_| "
    ]
  };

  const logo = [0, 1, 2, 3, 4].map((i) =>
    [letters.M[i], letters.e[i], letters.m[i], letters.o[i], letters.r[i], letters.a[i]].join(" ")
  );

  const gradientHex = ["#9C27B0", "#AB47BC", "#BA68C8", "#CE93D8", "#E1BEE7"];

  console.log();
  logo.forEach((line, index) => {
    console.log("  " + chalk.hex(gradientHex[index]).bold(line));
  });
  console.log();

  const title = `${theme.primaryDim("CLI")}  ${theme.muted(`v${VERSION}`)}`;
  const tagline = theme.text("Save a command. Find it later by what it does, not what you typed.");
  const divider = theme.dim("·".repeat(72));

  const usage =
    `${theme.primary("memora save")} ${theme.dim('"what it does"')}\n` +
    `${theme.muted("  saves the last command you typed")}\n\n` +
    `${theme.primary("memora run ")} ${theme.dim('"what it does"')}\n` +
    `${theme.muted("  finds it and asks if you want to run it")}`;

  console.log(
    boxen(`${title}\n${tagline}\n${divider}\n\n${usage}`, {
      padding: { top: 1, bottom: 1, left: 2, right: 2 },
      margin: { top: 0, bottom: 1, left: 1, right: 0 },
      borderStyle: "round",
      borderColor: "#D9B24C",
      dimBorder: true,
    })
  );
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
