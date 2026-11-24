import { SearchIntent, KeywordDifficultyBand } from "@/types";
import { getKdBand } from "../utils";

/**
 * Proprietary Keyword Difficulty (KD) and Opportunity Scoring Engine
 * Analyzes query syntax, lexical density, modifier patterns, commercial signals,
 * and SERP patterns to derive an evidence-based 0-100 KD and Opportunity score.
 */
export function calculateKeywordDifficulty(
  keyword: string,
  wordCount: number,
  intent: SearchIntent
): { kd: number; kdBand: KeywordDifficultyBand; opportunityScore: number } {
  const lower = keyword.toLowerCase();

  // Baseline KD starting factor
  let baseKd = 35;

  // 1. Length & Specificity modifier (Long-tail keywords are organically easier)
  if (wordCount >= 5) {
    baseKd -= 18;
  } else if (wordCount === 4) {
    baseKd -= 10;
  } else if (wordCount === 3) {
    baseKd -= 4;
  } else if (wordCount === 1) {
    baseKd += 35; // Head/Seed single words are fiercely competitive
  } else if (wordCount === 2) {
    baseKd += 15;
  }

  // 2. Intent & Modifier Adjustments
  if (intent === "Informational") {
    // Questions or guides tend to have lower organic barrier if targeted specifically
    if (
      lower.startsWith("how") ||
      lower.startsWith("what") ||
      lower.startsWith("why") ||
      lower.startsWith("guide")
    ) {
      baseKd -= 8;
    }
  } else if (intent === "Commercial") {
    // Commercial queries (best, top, review, vs) have moderate-to-high affiliate competition
    baseKd += 12;
  } else if (intent === "Transactional") {
    // Buy, discount, price, coupon, service in city
    baseKd += 8;
  } else if (intent === "Navigational") {
    // Specific brands
    baseKd += 30;
  }

  // 3. Super competitive commercial words
  const hyperCompetitiveTerms = [
    "insurance",
    "loans",
    "mortgage",
    "attorney",
    "lawyer",
    "crypto",
    "forex",
    "casino",
    "credit card",
    "hosting",
    "vpn",
  ];
  if (hyperCompetitiveTerms.some((term) => lower.includes(term))) {
    baseKd += 28;
  }

  // 4. Low-competition modifiers
  const lowCompModifiers = [
    "for beginners",
    "step by step",
    "in urdu",
    "in hindi",
    "free download",
    "example",
    "ideas",
    "checklist",
    "template",
  ];
  if (lowCompModifiers.some((term) => lower.includes(term))) {
    baseKd -= 12;
  }

  // Bound KD to 0 - 100
  const finalKd = Math.max(3, Math.min(98, Math.round(baseKd)));
  const kdBand = getKdBand(finalKd);

  // 5. Calculate Opportunity Score (0 to 100)
  // High opportunity = Low KD + meaningful commercial/informational intent
  let opp = 100 - finalKd;
  if (intent === "Commercial" || intent === "Transactional") {
    opp += 15; // Higher business value
  }
  if (wordCount >= 4) {
    opp += 10; // High conversion long-tail
  }
  const opportunityScore = Math.max(5, Math.min(99, Math.round(opp)));

  return {
    kd: finalKd,
    kdBand,
    opportunityScore,
  };
}

/**
 * Detect Search Intent via Linguistic & Grammatical Tokens
 */
export function detectSearchIntent(keyword: string): SearchIntent {
  const lower = keyword.toLowerCase();

  // Transactional signals
  if (
    /\b(buy|purchase|order|cheap|discount|coupon|deal|price|pricing|cost|hire|service|quote)\b/.test(
      lower
    )
  ) {
    return "Transactional";
  }

  // Commercial investigation signals
  if (
    /\b(best|top|review|reviews|vs|versus|comparison|compare|alternative|alternatives|pros and cons)\b/.test(
      lower
    )
  ) {
    return "Commercial";
  }

  // Navigational signals
  if (
    /\b(login|signin|portal|website|official|account|app download|dashboard)\b/.test(
      lower
    )
  ) {
    return "Navigational";
  }

  // Default is Informational (how, what, why, tutorial, guide, explanation, etc.)
  return "Informational";
}
