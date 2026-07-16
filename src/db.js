import Conf from "conf";
import { nanoid } from "nanoid";

// `conf` automatically stores data in the correct OS location:
// Windows: %APPDATA%\memora-cli\config.json
// macOS:   ~/Library/Preferences/memora-cli
// Linux:   ~/.config/memora-cli
const store = new Conf({
  projectName: "memora-cli",
  defaults: { entries: [] },
});

export function getAll() {
  return store.get("entries");
}

export function addEntry({ description, command, tags = [] }) {
  const entries = getAll();
  const entry = {
    id: nanoid(8),
    description,
    command,
    tags,
    createdAt: new Date().toISOString(),
    lastUsed: null,
    useCount: 0,
  };
  entries.unshift(entry);
  store.set("entries", entries);
  return entry;
}

export function removeEntry(id) {
  const entries = getAll();
  const next = entries.filter((e) => e.id !== id);
  const removed = entries.length !== next.length;
  store.set("entries", next);
  return removed;
}

export function touchEntry(id) {
  const entries = getAll();
  const entry = entries.find((e) => e.id === id);
  if (entry) {
    entry.useCount += 1;
    entry.lastUsed = new Date().toISOString();
    store.set("entries", entries);
  }
  return entry;
}

export function updateEntry(id, updates) {
  const entries = getAll();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return null;
  Object.assign(entry, updates, { updatedAt: new Date().toISOString() });
  store.set("entries", entries);
  return entry;
}

export function clearAll() {
  store.set("entries", []);
}

export function saveAll(entries) {
  store.set("entries", entries);
}

export function getStorePath() {
  return store.path;
}
