"use client";

import React, { useState } from "react";
import { Sparkles, FileText, CheckCircle2, Copy, Check, BookOpen, Code2 } from "lucide-react";
import { generateContentBrief } from "@/lib/providers/ai-brief-generator";
import { generateFullSeoArticle, GeneratedArticle } from "@/lib/providers/ai-article-generator";
import { ContentBrief } from "@/types";

export const AiBriefsTab: React.FC = () => {
  const [keyword, setKeyword] = useState("how to start affiliate marketing");
  const [brief, setBrief] = useState<ContentBrief | null>(null);
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [activeView, setActiveView] = useState<"brief" | "article" | "schema">("brief");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    const generatedBrief = generateContentBrief(keyword, "United States", "en", []);
    setBrief(generatedBrief);
    const generatedArticle = generateFullSeoArticle(generatedBrief);
    setArticle(generatedArticle);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">AI Content Brief & Full Article Generator</h3>
            <p className="text-xs text-slate-400">
              Generate structured article outlines, H2/H3 headings, and complete ready-to-publish SEO articles.
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
            <span>Generate Content & Article</span>
          </button>
        </div>
      </div>

      {brief && article && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          {/* View Toggles & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveView("brief")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === "brief"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>SEO Content Brief</span>
              </button>
              <button
                onClick={() => setActiveView("article")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === "article"
                    ? "bg-purple-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Full Article ({article.targetWordCount} words)</span>
              </button>
              <button
                onClick={() => setActiveView("schema")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === "schema"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>FAQ Schema JSON-LD</span>
              </button>
            </div>

            <button
              onClick={() =>
                handleCopy(
                  activeView === "article"
                    ? article.markdownContent
                    : activeView === "schema"
                    ? article.faqSchemaJson
                    : `# ${brief.targetHeadings.h1}\n\n${brief.targetHeadings.h2.join("\n")}`
                )
              }
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Current View</span>
                </>
              )}
            </button>
          </div>

          {/* VIEW 1: Brief */}
          {activeView === "brief" && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Target Article Blueprint
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {brief.targetHeadings.h1}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Strategy Overview</span>
                  <p className="text-sm text-slate-200">
                    Content Angle: <strong className="text-white">{brief.suggestedAngle}</strong>
                  </p>
                  <p className="text-sm text-slate-200">
                    Target Word Range:{" "}
                    <strong className="text-white">
                      {brief.recommendedWordCount.min} – {brief.recommendedWordCount.max} words
                    </strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Semantic NLP Entities</span>
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

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Headings Structure (H2)
                </h4>
                {brief.targetHeadings.h2.map((h2, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm font-medium text-slate-200 flex items-center space-x-2"
                  >
                    <span className="text-blue-500 font-bold text-xs">H2.</span>
                    <span>{h2}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: Full Article */}
          {activeView === "article" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-300 font-semibold uppercase">WordPress & Markdown Ready</p>
                  <p className="text-sm text-white font-bold">{article.metaTitle}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                  {article.targetWordCount} Words
                </span>
              </div>

              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
                {article.markdownContent}
              </div>
            </div>
          )}

          {/* VIEW 3: FAQ Schema */}
          {activeView === "schema" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Paste this JSON-LD script inside your webpage &lt;head&gt; tag for instant Google Rich FAQ Snippets:
              </p>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto">
                {`<script type="application/ld+json">\n${article.faqSchemaJson}\n</script>`}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
