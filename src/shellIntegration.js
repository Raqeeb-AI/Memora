import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { theme } from "./theme.js";
import { printSuccessBox } from "./banner.js";

export function installShellHook() {
    if (process.platform === "win32") {
        console.log(theme.muted("Shell integration is not required on Windows. memora works automatically here."));
        return;
    }

    const shellPath = process.env.SHELL || "";
    const isZsh = shellPath.includes("zsh");
    const isBash = shellPath.includes("bash");

    if (!isZsh && !isBash) {
        console.log(theme.warn("Shell integration isn't supported for this shell yet."));
        return;
    }

    const home = os.homedir();
    const memoraDir = path.join(home, ".memora");

    if (!fs.existsSync(memoraDir)) {
        fs.mkdirSync(memoraDir, { recursive: true });
    }

    const marker = "# memora-shell-integration";

    if (isZsh) {
        const rcPath = path.join(home, ".zshrc");
        const added = appendToRc(rcPath, marker, getZshBlock());
        if (added) printInstructions(rcPath);
    } else if (isBash) {
        const rcPath1 = path.join(home, ".bashrc");
        const rcPath2 = path.join(home, ".bash_profile");
        let added = false;
        added = appendToRc(rcPath1, marker, getBashBlock()) || added;
        added = appendToRc(rcPath2, marker, getBashBlock()) || added;

        if (added) {
            printInstructions(rcPath1);
        }
    }
}

function appendToRc(filePath, marker, block) {
    let content = "";
    if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, "utf8");
    }

    if (content.includes(marker)) {
        console.log(theme.muted(`Already installed in ${filePath}`));
        return false;
    }

    fs.appendFileSync(filePath, "\n" + block + "\n");
    return true;
}

function printInstructions(file) {
    printSuccessBox([
        "Shell integration completely installed!",
        "",
        "To use it immediately, restart your terminal or run:",
        theme.primary(`source ${file}`)
    ]);
}

function getZshBlock() {
    return `# memora-shell-integration
__memora_preexec() {
  echo "$1" >> "$HOME/.memora/recent-commands"
  tail -n 20 "$HOME/.memora/recent-commands" > "$HOME/.memora/recent-commands.tmp" 2>/dev/null && mv "$HOME/.memora/recent-commands.tmp" "$HOME/.memora/recent-commands"
}
autoload -Uz add-zsh-hook
add-zsh-hook preexec __memora_preexec
# end-memora-shell-integration`;
}

function getBashBlock() {
    return `# memora-shell-integration
__memora_debug_trap() {
  [ -n "$COMP_LINE" ] && return
  echo "$BASH_COMMAND" >> "$HOME/.memora/recent-commands"
  tail -n 20 "$HOME/.memora/recent-commands" > "$HOME/.memora/recent-commands.tmp" 2>/dev/null && mv "$HOME/.memora/recent-commands.tmp" "$HOME/.memora/recent-commands"
}
trap '__memora_debug_trap' DEBUG
# end-memora-shell-integration`;
}
