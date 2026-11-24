import { NextRequest, NextResponse } from "next/server";
import { fetchAggregatedKeywordSuggestions } from "@/lib/providers";
import { calculateKeywordDifficulty, detectSearchIntent } from "@/lib/providers/kd-engine";
import { generateContentBrief } from "@/lib/providers/ai-brief-generator";
import { getCountryByCode } from "@/data/countries";
import { SearchPlatform } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();
    const country = searchParams.get("country")?.toUpperCase() || "US";
    const language = searchParams.get("language") || "en";
    const platform = (searchParams.get("platform") as SearchPlatform) || "google";

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const countryData = getCountryByCode(country);
    const countryName = countryData ? countryData.name : country;

    // Fetch real keyword suggestions tree
    const suggestions = await fetchAggregatedKeywordSuggestions(query, country, language, platform);

    // Compute metrics for the root seed keyword
    const seedWords = query.split(/\s+/).filter(Boolean);
    const seedIntent = detectSearchIntent(query);
    const { kd: seedKd, kdBand: seedKdBand, opportunityScore: seedOpportunity } =
      calculateKeywordDifficulty(query, seedWords.length, seedIntent);

    // Check if query triggers Google AI Overview (typically informational / question patterns)
    const hasAiOverview =
      platform === "google" &&
      (query.toLowerCase().startsWith("what") ||
        query.toLowerCase().startsWith("how") ||
        query.toLowerCase().startsWith("why") ||
        query.toLowerCase().includes("difference between") ||
        seedWords.length >= 4);

    // Generate AI Content Blueprint
    const brief = generateContentBrief(query, countryName, language, suggestions);

    return NextResponse.json({
      success: true,
      query,
      country: {
        code: country,
        name: countryName,
        currency: countryData?.currency || { code: "USD", symbol: "$" },
      },
      language,
      platform,
      seedMetrics: {
        keyword: query,
        searchVolume: null, // Transparently labeled as null when on free-first mode
        cpc: null,
        paidCompetition: null,
        keywordDifficulty: seedKd,
        kdBand: seedKdBand,
        searchIntent: seedIntent,
        opportunityScore: seedOpportunity,
        hasAiOverview,
        provider: "Algorithmic Model & Real Autocomplete Tree",
        isVerified: false,
        sourceType: "Autocomplete Tree & Algorithmic Model",
      },
      suggestionsCount: suggestions.length,
      suggestions,
      brief,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message || "Failed to fetch keyword data" },
      { status: 500 }
    );
  }
}
