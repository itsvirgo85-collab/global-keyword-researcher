import { KeywordSuggestion, SearchPlatform } from "@/types";
import { calculateKeywordDifficulty, detectSearchIntent } from "./kd-engine";

/**
 * Fetch raw suggestions from YouTube Autocomplete API
 */
async function fetchYouTubeSuggest(
  query: string,
  countryCode: string,
  langCode: string
): Promise<string[]> {
  try {
    const gl = countryCode.toLowerCase();
    const hl = langCode.toLowerCase();
    const url = `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&gl=${gl}&hl=${hl}&q=${encodeURIComponent(
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

    const text = await res.text();
    // YouTube returns a JSONP-like format: window.google.ac.h([...])
    const match = text.match(/window\.google\.ac\.h\((.*)\)/);
    if (match && match[1]) {
      const data = JSON.parse(match[1]);
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1].map((item: any) => (Array.isArray(item) ? item[0] : item));
      }
    } else {
      // Try direct JSON parsing
      const json = JSON.parse(text);
      if (Array.isArray(json) && Array.isArray(json[1])) {
        return json[1].map((item: any) => (Array.isArray(item) ? item[0] : item));
      }
    }
    return [];
  } catch (err) {
    console.error("YouTube Suggest error:", err);
    return [];
  }
}

/**
 * Harvest YouTube video search ideas
 */
export async function harvestYouTubeKeywords(
  seed: string,
  countryCode: string,
  langCode: string
): Promise<KeywordSuggestion[]> {
  const trimmed = seed.trim();
  if (!trimmed) return [];

  const rawKeywords = new Set<string>();

  const [base, howTo, tutorial] = await Promise.all([
    fetchYouTubeSuggest(trimmed, countryCode, langCode),
    fetchYouTubeSuggest(`how to ${trimmed}`, countryCode, langCode),
    fetchYouTubeSuggest(`${trimmed} tutorial`, countryCode, langCode),
  ]);

  base.forEach((k) => rawKeywords.add(k));
  howTo.forEach((k) => rawKeywords.add(k));
  tutorial.forEach((k) => rawKeywords.add(k));

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

    results.push({
      keyword: cleanKw,
      type: cleanKw.includes("how to") || cleanKw.includes("tutorial") ? "questions" : "matching",
      platform: "youtube" as SearchPlatform,
      wordCount: words.length,
      intent,
      estimatedKd: kd,
      kdBand,
      opportunityScore,
    });
  }

  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}
