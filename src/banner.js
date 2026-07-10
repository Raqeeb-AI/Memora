import chalk from "chalk";
import figlet from "figlet";
import gradientString from "gradient-string";
import boxen from "boxen";
import { theme } from "./theme.js";

const memoraGradient = gradientString(["#7C5CFC", "#00D9C0"]);

export function printBanner() {
  const title = figlet.textSync("Memora", {
    font: "Standard",
    horizontalLayout: "fitted",
  });

  console.log("\n" + memoraGradient.multiline(title));

  const subtitle = boxen(
    `${theme.text("Never forget a command again.")}\n` +
    `${theme.muted(
      "Save the commands you always forget. Find them by what they do, not what you typed."
    )}`,
    {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: { top: 0, bottom: 1, left: 0, right: 0 },
      borderStyle: "round",
      borderColor: "#7C5CFC",
    }
  );

  console.log(subtitle);
}

export function printMiniHeader(text) {
  console.log(theme.primary.bold(`\n${text}`));
  console.log(theme.muted("─".repeat(Math.min(text.length + 4, 60))));
}

export function printSuccessBox(lines) {
  console.log(
    boxen(lines.join("\n"), {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      borderStyle: "round",
      borderColor: "#00D9C0",
    })
  );
}

export const VERSION = "1.0.3";
