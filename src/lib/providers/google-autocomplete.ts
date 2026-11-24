import { KeywordSuggestion, SearchPlatform } from "@/types";
import { calculateKeywordDifficulty, detectSearchIntent } from "./kd-engine";

/**
 * Fetch raw suggestions from Google Autocomplete API
 */
async function fetchGoogleSuggest(
  query: string,
  countryCode: string,
  langCode: string
): Promise<string[]> {
  try {
    const gl = countryCode.toLowerCase();
    const hl = langCode.toLowerCase();
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&gl=${gl}&hl=${hl}&q=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[1])) {
      return data[1] as string[];
    }
    return [];
  } catch (err) {
    console.error("Google Suggest error:", err);
    return [];
  }
}

/**
 * Harvest multi-level keyword ideas (Seed + Questions + Modifiers + Alphabetic branches)
 */
export async function harvestGoogleKeywordTree(
  seed: string,
  countryCode: string,
  langCode: string
): Promise<KeywordSuggestion[]> {
  const trimmed = seed.trim();
  if (!trimmed) return [];

  const rawKeywords = new Set<string>();

  // 1. Base suggestions
  const baseSuggestions = await fetchGoogleSuggest(trimmed, countryCode, langCode);
  baseSuggestions.forEach((k) => rawKeywords.add(k));

  // 2. Question prefixes
  const questionPrefixes = ["how to", "what is", "why", "best"];
  await Promise.all(
    questionPrefixes.map(async (prefix) => {
      const results = await fetchGoogleSuggest(`${prefix} ${trimmed}`, countryCode, langCode);
      results.forEach((k) => rawKeywords.add(k));
    })
  );

  // 3. Modifier / Preposition expansions
  const prepositions = ["for", "with", "vs", "without"];
  await Promise.all(
    prepositions.map(async (prep) => {
      const results = await fetchGoogleSuggest(`${trimmed} ${prep}`, countryCode, langCode);
      results.forEach((k) => rawKeywords.add(k));
    })
  );

  // Convert and score each found keyword
  const results: KeywordSuggestion[] = [];

  for (const kw of Array.from(rawKeywords)) {
    const cleanKw = kw.trim();
    if (!cleanKw) continue;

    const words = cleanKw.split(/\s+/).filter(Boolean);
    const intent = detectSearchIntent(cleanKw);
    const { kd, kdBand, opportunityScore } = calculateKeywordDifficulty(
      cleanKw,
      words.length,
      intent
    );

    let type: KeywordSuggestion["type"] = "matching";
    if (
      cleanKw.startsWith("how") ||
      cleanKw.startsWith("what") ||
      cleanKw.startsWith("why") ||
      cleanKw.startsWith("when") ||
      cleanKw.startsWith("where")
    ) {
      type = "questions";
    } else if (words.length >= 4) {
      type = "long-tail";
    } else if (intent === "Commercial" || intent === "Transactional") {
      type = "high-intent";
    } else {
      type = "related";
    }

    results.push({
      keyword: cleanKw,
      type,
      platform: "google" as SearchPlatform,
      wordCount: words.length,
      intent,
      estimatedKd: kd,
      kdBand,
      opportunityScore,
    });
  }

  // Sort by opportunity score descending
  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}
