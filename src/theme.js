import chalk from "chalk";

// Central color palette so the whole CLI feels consistent.
export const theme = {
  primary: chalk.hex("#7C5CFC"),      // violet - brand color
  primaryBright: chalk.hex("#9C87FF"),
  accent: chalk.hex("#00D9C0"),       // teal - success / highlights
  warn: chalk.hex("#FFB020"),
  danger: chalk.hex("#FF5C5C"),
  muted: chalk.hex("#8A8A9E"),
  text: chalk.hex("#E8E8F0"),
  dim: chalk.dim,
  bold: chalk.bold,
};

export const symbols = {
  bullet: theme.primary("›"),
  check: theme.accent("✔"),
  cross: theme.danger("✖"),
  arrow: theme.primary("➜"),
  spark: "✨",
  brain: "🧠",
  save: theme.accent("💾"),
  search: theme.primary("🔎"),
};
