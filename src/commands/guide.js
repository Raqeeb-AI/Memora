import { theme } from "../theme.js";
import { printMiniHeader } from "../banner.js";

export function guideCommand() {
    printMiniHeader("How to use memora");

    const width = 27;

    const rows = [
        { c: 'memora save "desc"', d: "Save the command you just ran" },
        { c: 'memora run "desc"', d: "Find a command and run it" },
        { c: 'memora find "desc"', d: "Find a command without running it" },
        { c: 'memora add "desc" -- cmd', d: "Add a command by typing it manually" },
        { c: 'memora list', d: "Show everything you've saved" },
        { c: 'memora delete [id]', d: "Delete a saved command" },
        { c: 'memora update', d: "Check for and install the latest version" },
        { c: 'memora setup-shell', d: "Setup live command tracking (Mac/Linux)" },
        { c: 'memora', d: "Open the interactive menu" },
    ];

    rows.forEach(({ c, d }) => {
        console.log(`  ${theme.primary(c.padEnd(width, " "))}  ${theme.muted(d)}`);
    });
    console.log();
}
