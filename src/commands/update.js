import { spawnSync } from "child_process";
import { VERSION, printSuccessBox } from "../banner.js";
import { theme, symbols } from "../theme.js";

function isNewer(latest, current) {
    const a = latest.split(".").map(Number);
    const b = current.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
        if ((a[i] || 0) > (b[i] || 0)) return true;
        if ((a[i] || 0) < (b[i] || 0)) return false;
    }
    return false;
}

export async function updateCommand() {
    console.log(theme.muted("\nChecking for updates..."));
    try {
        const res = await fetch("https://registry.npmjs.org/memora-cmd/latest");
        if (!res.ok) throw new Error("Registry offline");
        const data = await res.json();
        const latest = data.version;

        if (isNewer(latest, VERSION)) {
            console.log(theme.primary(`\nUpdating to v${latest}...`));
            const result = spawnSync("npm", ["install", "-g", "memora-cmd"], {
                stdio: "inherit",
                shell: true
            });

            if (result.error || result.status !== 0) {
                console.log(theme.danger(`\n${symbols.cross} Update failed. Try running manually:`));
                console.log(theme.primary("npm install -g memora-cmd\n"));
            } else {
                console.log();
                printSuccessBox([`Updated to v${latest} — restart your terminal to use it.`]);
                console.log();
            }
        } else {
            console.log(theme.accent(`\n${symbols.check} You're already on the latest version (v${VERSION}).\n`));
        }
    } catch (err) {
        console.log(theme.warn(`\nCouldn't check for updates — check your internet connection.\n`));
    }
}
