import { pipeline, env } from "@xenova/transformers";
import path from "node:path";
import { homedir } from "node:os";

// Store models in the user's home directory to avoid permission issues when installed globally
env.cacheDir = path.join(homedir(), ".memora", "models");

// Disable local models loading strictly from cache to avoid issues sometimes, 
// wait, by default Xenova downloads to a local cache. That's good for offline use.
let extractor = null;

async function getExtractor() {
  if (!extractor) {
    // This model is extremely lightweight and fast, perfect for high-quality semantic search
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

// Compute cosine similarity between two 1D Float32Arrays
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Calculate the embedding vector for a string
async function getEmbedding(text) {
  const model = await getExtractor();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return output.data;
}

const TIE_DELTA = 0.03;

/**
 * Rank saved entries against a query.
 * Returns an array of { item, score } sorted best-first.
 * Within a "tied" relevance band, usage count and recency break the tie.
 */
export async function rankMatches(entries, query) {
  if (!query || !query.trim()) {
    return entries
      .map((item) => ({ item, score: null }))
      .sort((a, b) => (b.item.useCount || 0) - (a.item.useCount || 0));
  }

  const queryEmbedding = await getEmbedding(query);

  const results = [];
  for (const item of entries) {
    const textToMatch = [item.description, (item.tags || []).join(" ")].filter(Boolean).join(" ");
    const embedding = await getEmbedding(textToMatch);
    const score = cosineSimilarity(queryEmbedding, embedding);
    results.push({ item, score });
  }

  results.sort((a, b) => b.score - a.score);

  // Return matches that have a decent similarity score (e.g. > 0.25)
  const filtered = results.filter(r => r.score >= 0.25);

  if (filtered.length === 0) return [];

  const best = filtered[0].score;
  const tied = filtered.filter((r) => best - r.score <= TIE_DELTA);
  const rest = filtered.filter((r) => best - r.score > TIE_DELTA);

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
export async function findSimilar(entries, description, threshold = 0.8) {
  if (!entries.length || !description) return null;
  const ranked = await rankMatches(entries, description);
  if (ranked.length && ranked[0].score >= threshold) {
    return ranked[0].item;
  }
  return null;
}
