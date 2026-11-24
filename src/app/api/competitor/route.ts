import { NextRequest, NextResponse } from "next/server";
import { analyzeCompetitorUrl } from "@/lib/providers/competitor-analyzer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url")?.trim();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const analysis = await analyzeCompetitorUrl(url);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (err: any) {
    console.error("Competitor API error:", err);
    return NextResponse.json(
      { error: "Failed to analyze competitor URL", message: err?.message },
      { status: 500 }
    );
  }
}
