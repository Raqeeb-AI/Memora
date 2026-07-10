import Fuse from "fuse.js";

// Text relevance is ALWAYS the primary signal. Usage frequency only breaks
// ties between matches that are already nearly equally relevant — it never
// overrides a clearly better text match. This avoids the trap where a
// frequently-used command drowns out a rarer, more relevant one.
const TIE_DELTA = 0.08;

const searchOptions = {
  keys: [
    { name: "description", weight: 0.6 },
    { name: "tags", weight: 0.25 },
    { name: "command", weight: 0.15 },
  ],
  threshold: 0.4,
  includeScore: true,
};

/**
 * Rank saved entries against a query.
 * Returns an array of { item, score } sorted best-first.
 * Within a "tied" relevance band, usage count and recency break the tie.
 */
export function rankMatches(entries, query) {
  if (!query || !query.trim()) {
    return entries
      .map((item) => ({ item, score: null }))
      .sort((a, b) => (b.item.useCount || 0) - (a.item.useCount || 0));
  }

  const fuse = new Fuse(entries, searchOptions);
  const results = fuse.search(query); // lower score = better match

  if (results.length === 0) return [];

  const best = results[0].score;
  const tied = results.filter((r) => r.score - best <= TIE_DELTA);
  const rest = results.filter((r) => r.score - best > TIE_DELTA);

  tied.sort((a, b) => {
    const useDiff = (b.item.useCount || 0) - (a.item.useCount || 0);
    if (useDiff !== 0) return useDiff;
    return new Date(b.item.lastUsed || 0) - new Date(a.item.lastUsed || 0);
  });

  return [...tied, ...rest];
}

/**
 * Used at save time: warns if a very similar description already exists,
 * so the list doesn't fill up with near-duplicate entries.
 */
export function findSimilar(entries, description, threshold = 0.38) {
  if (!entries.length || !description) return null;
  const fuse = new Fuse(entries, {
    keys: ["description"],
    threshold: 0.5,
    includeScore: true,
  });
  const results = fuse.search(description);
  if (results.length && results[0].score <= threshold) {
    return results[0].item;
  }
  return null;
}
