import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import koffi from "koffi";

let kernel32, GetConsoleCommandHistoryLengthW, GetConsoleCommandHistoryW;

if (process.platform === "win32") {
  try {
    kernel32 = koffi.load("kernel32.dll");
    GetConsoleCommandHistoryLengthW = kernel32.func(
      "int __stdcall GetConsoleCommandHistoryLengthW(const char16_t *lpExeName)"
    );
    GetConsoleCommandHistoryW = kernel32.func(
      "int __stdcall GetConsoleCommandHistoryW(char16_t *lpHistory, int nHistoryBufferLength, const char16_t *lpExeName)"
    );
  } catch (e) {
    // Ignore koffi initialization errors
  }
}


/**
 * Best-effort detection of "the command you typed right before this one."
 * Returns a string or null if nothing could be found.
 *
 * This is inherently platform-dependent — there's no universal API for
 * "give me my previous shell command." We try the most reliable method
 * per platform and fail silently (returning null) if it doesn't work,
 * so the caller can fall back to clipboard or manual entry.
 */
function isIgnoredMemoraCommand(cmd) {
  if (!cmd) return false;
  const lower = cmd.trim().toLowerCase();
  return (
    lower === "memora" ||
    lower.startsWith("memora ") ||
    lower.startsWith("memora.js ") ||
    lower.includes("memora save") ||
    lower.startsWith("npx memora") ||
    (lower.startsWith("node ") && lower.includes("memora"))
  );
}

export function getLastTypedCommand() {
  let cmd = null;
  if (process.platform === "win32") {
    cmd = getLastWindowsCommand();
  } else {
    cmd = getLastUnixCommand();
  }

  if (isIgnoredMemoraCommand(cmd)) {
    return null;
  }

  return cmd;
}

function getConsoleHistory(exeName = "cmd.exe") {
  if (!GetConsoleCommandHistoryLengthW || !GetConsoleCommandHistoryW) return [];

  try {
    const lengthInChars = GetConsoleCommandHistoryLengthW(exeName);
    if (!lengthInChars || lengthInChars <= 0) return [];

    const buffer = Buffer.alloc(lengthInChars * 2); // UTF-16LE
    const written = GetConsoleCommandHistoryW(buffer, lengthInChars, exeName);
    if (!written || written === 0) return [];

    const raw = buffer.toString("utf16le");
    return raw.split("\u0000").filter((s) => s.length > 0);
  } catch {
    return [];
  }
}

function getLastWindowsCommand() {
  try {
    const lines = getConsoleHistory("cmd.exe");
    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1].trim();
      if (isIgnoredMemoraCommand(lastLine)) {
        if (lines.length >= 2) return lines[lines.length - 2].trim();
      } else {
        return lastLine;
      }
    }
  } catch { }

  // Fallback for PowerShell consoles, where doskey history doesn't apply.
  try {
    const output = execSync(
      'powershell -NoProfile -Command "(Get-History | Select-Object -Last 2 | Select-Object -First 1).CommandLine"',
      { encoding: "utf8", windowsHide: true }
    ).trim();
    if (output) return output;
  } catch {
    // not PowerShell, or history unavailable
  }

  return null;
}

function getLastUnixCommand() {
  const memoraFile = path.join(homedir(), ".memora", "recent-commands");
  try {
    const content = readFileSync(memoraFile, "utf8");
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length > 0) return lines[lines.length - 1];
  } catch {
    return null;
  }
  return null;
}
