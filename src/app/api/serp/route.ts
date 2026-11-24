import { NextRequest, NextResponse } from "next/server";
import { fetchLiveSerpResults } from "@/lib/providers/serp-analyzer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();
    const country = searchParams.get("country")?.toUpperCase() || "US";
    const language = searchParams.get("language") || "en";

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const results = await fetchLiveSerpResults(query, country, language);

    return NextResponse.json({
      success: true,
      query,
      country,
      language,
      totalCount: results.length,
      results,
    });
  } catch (err: any) {
    console.error("SERP API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch SERP data", message: err?.message },
      { status: 500 }
    );
  }
}
