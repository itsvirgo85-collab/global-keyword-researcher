"use client";

import React, { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { KeywordSuggestion, SearchPlatform, ContentBrief } from "@/types";
import { getKdColor } from "@/lib/utils";
import {
  Search,
  Download,
  Sparkles,
  Bot,
  TrendingUp,
  Zap,
  ShoppingBag,
  Video,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

export const KeywordExplorer: React.FC = () => {
  const [query, setQuery] = useState("seo agency");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedLang, setSelectedLang] = useState("en");
  const [platform, setPlatform] = useState<SearchPlatform>("google");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    seedMetrics: any;
    suggestions: KeywordSuggestion[];
    brief: ContentBrief;
  } | null>(null);

  const [showBriefModal, setShowBriefModal] = useState(false);

  // Active country details
  const currentCountry = COUNTRIES.find((c) => c.code === selectedCountry) || COUNTRIES[0];

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    const country = COUNTRIES.find((c) => c.code === code);
    if (country) {
      setSelectedLang(country.defaultLanguage);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/keywords?query=${encodeURIComponent(
          query
        )}&country=${selectedCountry}&language=${selectedLang}&platform=${platform}`
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to retrieve keyword metrics");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Filter suggestions
  const filteredSuggestions = (data?.suggestions || []).filter((s) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "questions") return s.type === "questions";
    if (activeFilter === "long-tail") return s.type === "long-tail";
    if (activeFilter === "high-intent") return s.type === "high-intent";
    return true;
  });

  // CSV Export handler
  const handleExportCSV = () => {
    if (!data?.suggestions.length) return;

    const headers = ["Keyword", "Platform", "Word Count", "Intent", "Estimated KD", "KD Band", "Opportunity Score"];
    const rows = filteredSuggestions.map((s) => [
      `"${s.keyword.replace(/"/g, '""')}"`,
      s.platform,
      s.wordCount,
      s.intent,
      s.estimatedKd,
      s.kdBand,
      s.opportunityScore,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `keywords-${query}-${selectedCountry}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search & Targeting Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 transition-colors">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3">
          {/* Seed Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter seed keyword (e.g. ecommerce marketing, real estate, software)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors"
            />
          </div>

          {/* Country Selector */}
          <div className="w-full sm:w-56">
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="w-full sm:w-48">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {currentCountry.supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} {lang.isRTL ? "(RTL)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Explore</span>
              </>
            )}
          </button>
        </form>

        {/* Platform Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Target Search Engine:</span>
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPlatform("google")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  platform === "google"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform("youtube")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  platform === "youtube"
                    ? "bg-red-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                <span>YouTube</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform("amazon")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  platform === "amazon"
                    ? "bg-amber-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Amazon</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
            <span>Targeting {currentCountry.name} in {selectedLang.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-sm flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Cards Overview */}
      {data && data.seedMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Difficulty */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Keyword Difficulty</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {data.seedMetrics.keywordDifficulty}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">/ 100</span>
              </div>
              <span
                className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  getKdColor(data.seedMetrics.keywordDifficulty).bg
                } ${getKdColor(data.seedMetrics.keywordDifficulty).text} border ${
                  getKdColor(data.seedMetrics.keywordDifficulty).border
                }`}
              >
                {data.seedMetrics.kdBand}
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Zap className="h-6 w-6 text-amber-500" />
            </div>
          </div>

          {/* Search Intent */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Search Intent</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {data.seedMetrics.searchIntent}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                Derived via lexical query signals
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          {/* Opportunity Score */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Opportunity Score</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {data.seedMetrics.opportunityScore}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">/ 100</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Higher = Easier to rank</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-emerald-500" />
            </div>
          </div>

          {/* AI Overview (SGE) Status */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Google AI Overview (SGE)</p>
              <div className="flex items-center space-x-2 mt-1">
                {data.seedMetrics.hasAiOverview ? (
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center space-x-1">
                    <Bot className="h-3.5 w-3.5" />
                    <span>Likely Triggered</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                    Standard SERP
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Zero-Click impact assessment</p>
            </div>
            <button
              onClick={() => setShowBriefModal(true)}
              className="p-3 rounded-xl bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 transition-all flex flex-col items-center justify-center text-[10px] font-bold"
            >
              <FileText className="h-5 w-5 mb-1" />
              <span>AI Brief</span>
            </button>
          </div>
        </div>
      )}

      {/* Keyword Suggestions Table & Filtering */}
      {data && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: `All (${data.suggestions.length})` },
                {
                  id: "questions",
                  label: `Questions (${data.suggestions.filter((s) => s.type === "questions").length})`,
                },
                {
                  id: "long-tail",
                  label: `Long-tail (${data.suggestions.filter((s) => s.type === "long-tail").length})`,
                },
                {
                  id: "high-intent",
                  label: `High-Intent (${data.suggestions.filter((s) => s.type === "high-intent").length})`,
                },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeFilter === filter.id
                      ? "bg-slate-800 text-white dark:bg-slate-700"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Export & Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Keyword</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Words</th>
                  <th className="py-3 px-4">Intent</th>
                  <th className="py-3 px-4">Estimated KD</th>
                  <th className="py-3 px-4">Opportunity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {filteredSuggestions.map((item, idx) => {
                  const kdStyle = getKdColor(item.estimatedKd);
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {item.keyword}
                      </td>
                      <td className="py-3 px-4 text-xs capitalize text-slate-500 dark:text-slate-400">
                        {item.platform}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                        {item.wordCount}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.intent}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold border ${kdStyle.bg} ${kdStyle.text} ${kdStyle.border}`}
                          >
                            {item.estimatedKd}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                            {item.kdBand}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${item.opportunityScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {item.opportunityScore}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Content Brief Modal */}
      {showBriefModal && data?.brief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    1-Click AI SEO Content Brief
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Blueprint for: &quot;{data.brief.keyword}&quot; ({data.brief.country})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBriefModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Target Headings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Recommended Article Title & Angles
              </h4>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white">
                {data.brief.targetHeadings.h1}
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                <span>Angle: <strong className="text-slate-800 dark:text-slate-200">{data.brief.suggestedAngle}</strong></span>
                <span>•</span>
                <span>Recommended Length: <strong className="text-slate-800 dark:text-slate-200">{data.brief.recommendedWordCount.min} - {data.brief.recommendedWordCount.max} words</strong></span>
              </div>
            </div>

            {/* Target H2 Structure */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recommended H2 Section Structure
              </h4>
              <ul className="space-y-1.5 text-sm">
                {data.brief.targetHeadings.h2.map((h2, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                    <span className="text-blue-500 font-bold text-xs">H2.</span>
                    <span>{h2}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target FAQ Schema Questions
              </h4>
              <ul className="space-y-1.5 text-sm">
                {data.brief.frequentlyAskedQuestions.map((faq, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{faq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Semantic NLP Entities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Must-Include Semantic Entities
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {data.brief.nlpEntities.map((entity, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
