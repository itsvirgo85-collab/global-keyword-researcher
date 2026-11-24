import { KeywordSuggestion } from "@/types";

export interface ContentSiloCluster {
  siloName: string;
  pillarArticleTitle: string;
  description: string;
  keywords: string[];
  internalLinkingRule: string;
}

export function clusterKeywordsIntoSilos(
  seed: string,
  suggestions: KeywordSuggestion[]
): ContentSiloCluster[] {
  const cap = seed.charAt(0).toUpperCase() + seed.slice(1);

  // Group keywords into logical content buckets
  const questionKws: string[] = [];
  const commercialKws: string[] = [];
  const beginnerKws: string[] = [];
  const generalKws: string[] = [];

  suggestions.forEach((s) => {
    const lower = s.keyword.toLowerCase();
    if (
      lower.startsWith("how") ||
      lower.startsWith("what") ||
      lower.startsWith("why") ||
      lower.includes("tutorial")
    ) {
      questionKws.push(s.keyword);
    } else if (
      lower.includes("best") ||
      lower.includes("top") ||
      lower.includes("vs") ||
      lower.includes("review") ||
      lower.includes("pricing")
    ) {
      commercialKws.push(s.keyword);
    } else if (
      lower.includes("for beginners") ||
      lower.includes("free") ||
      lower.includes("step by step")
    ) {
      beginnerKws.push(s.keyword);
    } else {
      generalKws.push(s.keyword);
    }
  });

  const clusters: ContentSiloCluster[] = [
    {
      siloName: "1. Core Pillar (The Master Guide)",
      pillarArticleTitle: `${cap}: The Complete Definitive Guide`,
      description: "Comprehensive foundational asset acting as the parent pillar for your website's topical authority.",
      keywords: generalKws.slice(0, 8).concat([seed]),
      internalLinkingRule: "Links down to all supporting cluster articles; receives links back from every child post.",
    },
    {
      siloName: "2. How-To & Implementation Silo",
      pillarArticleTitle: `How to Successfully Master ${cap} Step by Step`,
      description: "Tactical educational articles targeting problem-solving and informational search intent.",
      keywords: questionKws.length > 0 ? questionKws.slice(0, 8) : [`how to learn ${seed}`, `step by step ${seed} guide`, `best way to do ${seed}`],
      internalLinkingRule: "Links back to Core Pillar in the introduction; cross-links with the Commercial Comparison silo.",
    },
    {
      siloName: "3. Commercial & Buyer Intent Silo",
      pillarArticleTitle: `Top Tools, Software & Solutions for ${cap}`,
      description: "High-converting commercial investigation keywords with strong affiliate and monetization potential.",
      keywords: commercialKws.length > 0 ? commercialKws.slice(0, 8) : [`best ${seed} software`, `${seed} vs alternatives`, `top ${seed} reviews`],
      internalLinkingRule: "Directs high-intent visitors to monetization pages and links to Pillar for authority.",
    },
    {
      siloName: "4. Beginner Fast-Track Silo",
      pillarArticleTitle: `${cap} For Complete Beginners: Getting Started`,
      description: "Low-competition, high-volume entry points attracting users at the very top of the marketing funnel.",
      keywords: beginnerKws.length > 0 ? beginnerKws.slice(0, 8) : [`${seed} for beginners`, `${seed} basics`, `simple ${seed} tips`],
      internalLinkingRule: "Funnel readers directly toward the comprehensive Core Pillar guide.",
    },
  ];

  return clusters;
}
