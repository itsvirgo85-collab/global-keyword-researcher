"use client";

import React, { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { calculateKeywordDifficulty, detectSearchIntent } from "@/lib/providers/kd-engine";
import { getKdColor } from "@/lib/utils";
import { Globe, ArrowRight, BarChart2 } from "lucide-react";

export const CountryComparison: React.FC = () => {
  const [keyword, setKeyword] = useState("web development agency");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "US",
    "GB",
    "PK",
    "IN",
    "DE",
    "AE",
    "CA",
  ]);

  const words = keyword.trim().split(/\s+/).filter(Boolean);
  const intent = detectSearchIntent(keyword);
  const { kd, kdBand, opportunityScore } = calculateKeywordDifficulty(
    keyword,
    words.length,
    intent
  );

  const toggleCountry = (code: string) => {
    if (selectedCountries.includes(code)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter((c) => c !== code));
      }
    } else {
      setSelectedCountries([...selectedCountries, code]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter seed keyword to compare globally..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            />
          </div>
        </div>

        {/* Country Badges */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400">Select Markets to Compare:</p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c) => {
              const isSelected = selectedCountries.includes(c.code);
              return (
                <button
                  key={c.code}
                  onClick={() => toggleCountry(c.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">
              Multi-Market Breakdown for &quot;{keyword}&quot;
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {selectedCountries.length} Markets Selected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Market / Country</th>
                <th className="py-3 px-4">Primary Language</th>
                <th className="py-3 px-4">Local Currency</th>
                <th className="py-3 px-4">Search Intent</th>
                <th className="py-3 px-4">Organic KD</th>
                <th className="py-3 px-4">Opportunity</th>
                <th className="py-3 px-4">Google Geo ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {selectedCountries.map((code) => {
                const country = COUNTRIES.find((c) => c.code === code);
                if (!country) return null;
                const kdStyle = getKdColor(kd);

                return (
                  <tr key={code} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100 flex items-center space-x-2">
                      <span className="text-lg">{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="text-xs text-slate-500">({country.code})</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-300">
                      {country.supportedLanguages[0].name}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-300">
                      {country.currency.code} ({country.currency.symbol})
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                        {intent}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold border ${kdStyle.bg} ${kdStyle.text} ${kdStyle.border}`}
                      >
                        {kd} ({kdBand})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-14 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${opportunityScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-300">
                          {opportunityScore}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">
                      {country.googleGeoId || "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
