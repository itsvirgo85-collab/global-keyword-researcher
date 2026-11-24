import { ContentBrief, KeywordSuggestion } from "@/types";

/**
 * 1-Click AI SEO Content Brief & Outline Generator
 * Analyzes keyword intent, modifiers, and search landscape to craft an optimal article blueprint.
 */
export function generateContentBrief(
  keyword: string,
  country: string,
  language: string,
  suggestions: KeywordSuggestion[]
): ContentBrief {
  const kw = keyword.trim();
  const lower = kw.toLowerCase();

  // Determine angle
  let suggestedAngle: ContentBrief["suggestedAngle"] = "Comprehensive Guide";
  if (lower.startsWith("best") || lower.startsWith("top") || lower.includes("vs")) {
    suggestedAngle = "Top Listicle";
  } else if (lower.startsWith("how to") || lower.startsWith("step by step")) {
    suggestedAngle = "Step-by-Step Tutorial";
  } else if (lower.includes("review") || lower.includes("alternatives")) {
    suggestedAngle = "Comparison / Review";
  }

  // Word count heuristics
  let minWords = 1500;
  let maxWords = 2500;
  if (suggestedAngle === "Top Listicle") {
    minWords = 2200;
    maxWords = 3500;
  } else if (suggestedAngle === "Step-by-Step Tutorial") {
    minWords = 1800;
    maxWords = 2800;
  }

  // Extract relevant question keywords
  const questions = suggestions
    .filter((s) => s.type === "questions" || s.keyword.toLowerCase().startsWith("how") || s.keyword.toLowerCase().startsWith("what"))
    .slice(0, 5)
    .map((s) => capitalizeFirstLetter(s.keyword) + "?");

  if (questions.length === 0) {
    questions.push(`What is ${kw}?`);
    questions.push(`How does ${kw} work?`);
    questions.push(`Is ${kw} worth it in ${new Date().getFullYear()}?`);
    questions.push(`What are the key benefits of ${kw}?`);
  }

  // Generate H2 headings based on the query structure and related suggestions
  const h2List: string[] = [
    `Introduction: Why ${capitalizeFirstLetter(kw)} Matters`,
    `Understanding the Fundamentals of ${capitalizeFirstLetter(kw)}`,
  ];

  if (suggestedAngle === "Top Listicle") {
    h2List.push(`Key Criteria We Used to Evaluate the Best Options`);
    h2List.push(`Top Recommended Solutions & Detailed Breakdown`);
  } else if (suggestedAngle === "Step-by-Step Tutorial") {
    h2List.push(`Prerequisites & What You Need Before Starting`);
    h2List.push(`Step-by-Step Implementation Guide`);
  } else {
    h2List.push(`Comprehensive Overview & Core Mechanics`);
    h2List.push(`Common Mistakes to Avoid With ${capitalizeFirstLetter(kw)}`);
  }

  h2List.push(`Frequently Asked Questions (FAQs)`);
  h2List.push(`Final Verdict & Actionable Next Steps`);

  // Subheadings (H3)
  const h3List: string[] = suggestions
    .slice(0, 4)
    .map((s) => capitalizeFirstLetter(s.keyword));

  // Extract NLP entities and semantically related terms
  const nlpEntities = Array.from(
    new Set(
      suggestions
        .flatMap((s) => s.keyword.split(/\s+/))
        .filter((w) => w.length > 3 && !["with", "from", "that", "this", "best", "what", "your"].includes(w.toLowerCase()))
    )
  ).slice(0, 12);

  return {
    keyword: kw,
    country,
    language,
    recommendedWordCount: { min: minWords, max: maxWords },
    targetHeadings: {
      h1: `${capitalizeFirstLetter(kw)}: The Complete ${new Date().getFullYear()} Strategy Guide`,
      h2: h2List,
      h3: h3List,
    },
    frequentlyAskedQuestions: questions,
    nlpEntities,
    suggestedAngle,
  };
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
