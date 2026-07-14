import chalk from "chalk";

// A restrained, premium palette: one accent color (warm gold) used
// sparingly for the brand and key highlights, near-white for primary
// text, and a soft gray for secondary text. Avoids the "rainbow" look —
// premium tools tend to use one accent color, not five.
export const theme = {
  primary: chalk.hex("#9C27B0").bold,   // Deep Neon Purple — brand + key highlights
  primaryDim: chalk.hex("#BA68C8"),     // Lighter purple
  secondary: chalk.hex("#D9B24C").bold, // Warm gold — supporting color
  secondaryDim: chalk.hex("#D9B24C"),
  text: chalk.hex("#F2F2F5"),           // near-white — primary readable text
  muted: chalk.hex("#9BA0AC"),          // soft gray — secondary text
  accent: chalk.hex("#3DDC97"),         // emerald — success states
  warn: chalk.hex("#F5B942"),           // amber — warnings
  danger: chalk.hex("#F0616D"),         // soft red — errors
  dim: chalk.dim,
  bold: chalk.bold,
};

export const symbols = {
  bullet: theme.secondary("›"),
  check: theme.accent("✓"),
  cross: theme.danger("✗"),
  arrow: theme.primary("→"),
};
