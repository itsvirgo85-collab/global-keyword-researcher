"use client";

import React, { useState } from "react";
import { GitFork, Sparkles, ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import { clusterKeywordsIntoSilos, ContentSiloCluster } from "@/lib/providers/topic-clustering";

export const TopicClusteringTab: React.FC = () => {
  const [seed, setSeed] = useState("affiliate marketing");
  const [clusters, setClusters] = useState<ContentSiloCluster[]>([]);

  const handleCluster = () => {
    if (!seed.trim()) return;
    const silos = clusterKeywordsIntoSilos(seed, []);
    setClusters(silos);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <GitFork className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Topical Authority & Content Silo Architecture</h3>
            <p className="text-xs text-slate-400">
              Transform raw keywords into structured content pillars and internal linking clusters.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Enter niche topic (e.g. coffee brewing, real estate investing)..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleCluster}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Content Silos</span>
          </button>
        </div>
      </div>

      {/* Silo Clusters Grid */}
      {clusters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clusters.map((cluster, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {cluster.siloName}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    Pillar Article Title
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {cluster.pillarArticleTitle}
                  </h4>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {cluster.description}
                </p>

                {/* Sub-keywords */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Supporting Cluster Keywords:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Internal Linking Rule */}
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-[11px] text-indigo-300 space-y-1 mt-4">
                <span className="font-bold flex items-center space-x-1">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Internal Linking Strategy:</span>
                </span>
                <p className="text-slate-300 pl-4">{cluster.internalLinkingRule}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
