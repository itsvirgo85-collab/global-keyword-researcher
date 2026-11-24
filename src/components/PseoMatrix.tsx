"use client";

import React, { useState } from "react";
import { Layers, Download, Plus, Trash2, Sparkles } from "lucide-react";

export const PseoMatrix: React.FC = () => {
  const [pattern, setPattern] = useState("Best {tool} for {niche}");
  const [toolsInput, setToolsInput] = useState("CRM\nProject Management\nEmail Marketing\nAccounting\nSEO");
  const [nichesInput, setNichesInput] = useState("Real Estate Agents\nLawyers\nDentists\nE-commerce Stores\nFreelancers");
  const [generatedList, setGeneratedList] = useState<string[]>([]);

  const handleGenerate = () => {
    const tools = toolsInput.split("\n").map((t) => t.trim()).filter(Boolean);
    const niches = nichesInput.split("\n").map((n) => n.trim()).filter(Boolean);

    const results: string[] = [];
    for (const tool of tools) {
      for (const niche of niches) {
        let kw = pattern.replace(/{tool}/gi, tool).replace(/{niche}/gi, niche);
        results.push(kw);
      }
    }
    setGeneratedList(results);
  };

  const handleExport = () => {
    if (!generatedList.length) return;
    const csvContent = "data:text/csv;charset=utf-8,Keyword\n" + generatedList.map((k) => `"${k}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pseo-matrix-keywords.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Programmatic SEO (pSEO) Matrix Generator</h3>
            <p className="text-xs text-slate-400">
              Bulk keyword matrix builder for local and programmatic directory websites.
            </p>
          </div>
        </div>

        {/* Template Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Formula Pattern (use &#123;tool&#125; and &#123;niche&#125; tokens):
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-sm font-medium focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Matrix Variable Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">&#123;tool&#125; Values (one per line):</label>
            <textarea
              rows={5}
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-xs font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">&#123;niche&#125; Values (one per line):</label>
            <textarea
              rows={5}
              value={nichesInput}
              onChange={(e) => setNichesInput(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-xs font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 shadow-lg shadow-purple-600/20"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate Combinations</span>
        </button>
      </div>

      {/* Results */}
      {generatedList.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white">
              Generated {generatedList.length} Programmatic Keywords
            </span>
            <button
              onClick={handleExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export All to CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {generatedList.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between font-medium"
              >
                <span>{item}</span>
                <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
