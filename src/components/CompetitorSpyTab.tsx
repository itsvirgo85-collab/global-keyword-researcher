"use client";

import React, { useState } from "react";
import { Search, Eye, AlertCircle, CheckCircle2, TrendingUp, Layers, FileText } from "lucide-react";
import { CompetitorAnalysis } from "@/lib/providers/competitor-analyzer";

export const CompetitorSpyTab: React.FC = () => {
  const [url, setUrl] = useState("https://ahrefs.com/blog/keyword-difficulty");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CompetitorAnalysis | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/competitor?url=${encodeURIComponent(url)}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to analyze competitor URL");
      }

      setData(json.analysis);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Competitor URL Spy & Content Extractor</h3>
            <p className="text-xs text-slate-400">
              Inspect any competitor URL to extract target keywords, heading structures, and find content gaps.
            </p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste competitor URL (e.g. https://domain.com/blog/article)..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-rose-500 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2"
          >
            {loading ? <span>Analyzing URL...</span> : <span>Spy on Competitor</span>}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-sm flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Results */}
      {data && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Analyzed Domain</span>
              <p className="text-lg font-bold text-white font-mono">{data.domain}</p>
              <p className="text-xs text-slate-500 truncate">{data.url}</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Content Length</span>
              <p className="text-2xl font-bold text-emerald-400">
                {data.estimatedWordCount.toLocaleString()} <span className="text-sm font-normal text-slate-400">words</span>
              </p>
              <p className="text-xs text-slate-500">Thorough body text depth</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Heading Coverage</span>
              <p className="text-2xl font-bold text-blue-400">
                {data.headings.h2.length} <span className="text-sm font-normal text-slate-400">H2 Sections</span>
              </p>
              <p className="text-xs text-slate-500">Structural density</p>
            </div>
          </div>

          {/* Page Title & Meta Description */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Page Title (H1 / Title Tag)</span>
              <p className="text-base font-bold text-white mt-0.5">{data.pageTitle}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Meta Description</span>
              <p className="text-sm text-slate-300 mt-0.5">{data.metaDescription}</p>
            </div>
          </div>

          {/* Detected Keywords Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <span className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-rose-400" />
              <span>Top Detected Keywords & Density</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.detectedKeywords.map((kw, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-sm font-semibold text-white truncate">{kw.keyword}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{kw.count} occurrences</span>
                    <span className="text-emerald-400">{kw.density}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Headings Structure */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <span className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>Competitor H2 Heading Outline</span>
            </span>

            <div className="space-y-2">
              {data.headings.h2.map((h2, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 flex items-center space-x-2">
                  <span className="text-rose-400 font-bold">H2.</span>
                  <span>{h2}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Gaps & Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Opportunities to Outrank Them</span>
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {data.contentGaps.map((gap, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-sm font-bold text-blue-400 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Their Key Ranking Strengths</span>
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {data.rankingStrengths.map((str, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
