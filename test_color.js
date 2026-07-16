import chalk from "chalk";
const logo = [
    "   ____ ___  ___  ____ ___  ____  _________ _",
    "  / __ `__ \\/ _ \\/ __ `__ \\/ __ \\/ ___/ __ `/",
    " / / / / / /  __/ / / / / / /_/ / /  / /_/ / ",
    "/_/ /_/ /_/\\___/_/ /_/ /_/\\____/_/   \\__,_/  "
];
const gradientHex = ["#9C27B0", "#AB47BC", "#BA68C8", "#CE93D8"];
logo.forEach((line, index) => {
    console.log("  " + chalk.hex(gradientHex[index]).bold(line));
});
