import figlet from 'figlet';
import fs from 'fs';
const text = "== Small ==\n" + figlet.textSync("memora", { font: "Small" }) +
    "\n== Slant ==\n" + figlet.textSync("memora", { font: "Slant" }) +
    "\n== Mini ==\n" + figlet.textSync("memora", { font: "Mini" });
fs.writeFileSync('fig2.txt', text, 'utf8');
