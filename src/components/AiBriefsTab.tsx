"use client";

import React, { useState } from "react";
import { Sparkles, FileText, CheckCircle2, Copy, Check } from "lucide-react";
import { generateContentBrief } from "@/lib/providers/ai-brief-generator";
import { ContentBrief } from "@/types";

export const AiBriefsTab: React.FC = () => {
  const [keyword, setKeyword] = useState("how to start affiliate marketing");
  const [brief, setBrief] = useState<ContentBrief | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    const generated = generateContentBrief(keyword, "United States", "en", []);
    setBrief(generated);
  };

  const handleCopy = () => {
    if (!brief) return;
    const markdown = `# ${brief.targetHeadings.h1}
**Recommended Word Count:** ${brief.recommendedWordCount.min} - ${brief.recommendedWordCount.max} words
**Content Angle:** ${brief.suggestedAngle}

## Target Section Outline
${brief.targetHeadings.h2.map((h2) => `### ${h2}`).join("\n")}

## Frequently Asked Questions (FAQs)
${brief.frequentlyAskedQuestions.map((q) => `- ${q}`).join("\n")}

## Target NLP Entities
${brief.nlpEntities.join(", ")}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">1-Click AI SEO Content Brief Generator</h3>
            <p className="text-xs text-slate-400">
              Generate structured article outlines, target H2/H3s, FAQ schema questions, and semantic entities.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter target topic or keyword..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-sm font-medium focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Brief</span>
          </button>
        </div>
      </div>

      {brief && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Article Blueprint
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {brief.targetHeadings.h1}
              </h2>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Content Strategy</span>
              <p className="text-sm text-slate-200">
                Angle: <strong className="text-white">{brief.suggestedAngle}</strong>
              </p>
              <p className="text-sm text-slate-200">
                Target Length:{" "}
                <strong className="text-white">
                  {brief.recommendedWordCount.min} – {brief.recommendedWordCount.max} words
                </strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Semantic Coverage</span>
              <div className="flex flex-wrap gap-1.5">
                {brief.nlpEntities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-300"
                  >
                    {ent}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* H2 Outlines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Target Headings Structure (H2)
            </h4>
            <div className="space-y-2">
              {brief.targetHeadings.h2.map((h2, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm font-medium text-slate-200 flex items-center space-x-2"
                >
                  <span className="text-blue-500 font-bold text-xs">Section {idx + 1}.</span>
                  <span>{h2}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recommended FAQ Schema Questions
            </h4>
            <div className="space-y-2">
              {brief.frequentlyAskedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm font-medium text-slate-200 flex items-center space-x-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
