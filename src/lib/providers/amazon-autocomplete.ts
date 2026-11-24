import { KeywordSuggestion, SearchPlatform } from "@/types";
import { calculateKeywordDifficulty, detectSearchIntent } from "./kd-engine";

/**
 * Fetch raw suggestions from Amazon Completion API
 */
async function fetchAmazonSuggest(query: string): Promise<string[]> {
  try {
    const url = `https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&prefix=${encodeURIComponent(
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
    if (data && Array.isArray(data.suggestions)) {
      return data.suggestions.map((s: any) => s.value).filter(Boolean);
    }
    return [];
  } catch (err) {
    console.error("Amazon Suggest error:", err);
    return [];
  }
}

/**
 * Harvest Amazon / E-commerce high-intent buyer keywords
 */
export async function harvestAmazonKeywords(seed: string): Promise<KeywordSuggestion[]> {
  const trimmed = seed.trim();
  if (!trimmed) return [];

  const rawKeywords = new Set<string>();

  const [base, best, cheap] = await Promise.all([
    fetchAmazonSuggest(trimmed),
    fetchAmazonSuggest(`best ${trimmed}`),
    fetchAmazonSuggest(`${trimmed} for`),
  ]);

  base.forEach((k) => rawKeywords.add(k));
  best.forEach((k) => rawKeywords.add(k));
  cheap.forEach((k) => rawKeywords.add(k));

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
      type: "high-intent",
      platform: "amazon" as SearchPlatform,
      wordCount: words.length,
      intent: "Transactional", // Amazon search queries are inherently commercial/transactional
      estimatedKd: kd,
      kdBand,
      opportunityScore,
    });
  }

  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}
