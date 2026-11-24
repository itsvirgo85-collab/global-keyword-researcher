"use client";

import React, { useState } from "react";
import { Search, Globe, ExternalLink, Shield, AlertCircle } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import { SERPResultItem } from "@/types";

export const SerpAnalyzerTab: React.FC = () => {
  const [query, setQuery] = useState("best crm software");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SERPResultItem[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/serp?query=${encodeURIComponent(query)}&country=${selectedCountry}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch SERP results");
      }

      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Live Google SERP Top 10 Analyzer</h3>
            <p className="text-xs text-slate-400">
              Inspect current top-ranking pages, domain authorities, titles, and snippets.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter target keyword to inspect Google Top 10..."
              className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-sm font-medium focus:ring-2 focus:ring-blue-500"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2"
          >
            {loading ? <span>Scanning SERP...</span> : <span>Analyze SERP</span>}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-sm flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results List */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-slate-300">
              Top {results.length} Google Organic Results for &quot;{query}&quot;
            </span>
            <span className="text-xs text-slate-500">Live Web Inspection</span>
          </div>

          {results.map((item) => (
            <div
              key={item.position}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="h-7 w-7 rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/30 flex-shrink-0 mt-0.5">
                    #{item.position}
                  </div>
                  <div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-base text-blue-400 hover:underline flex items-center space-x-1.5"
                    >
                      <span>{item.title}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </a>
                    <p className="text-xs font-mono text-emerald-400 mt-0.5">{item.domain}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Est. Authority</p>
                    <p className="text-xs font-bold text-white">{item.estimatedAuthority} / 100</p>
                  </div>
                  <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${item.estimatedAuthority}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-10">{item.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
