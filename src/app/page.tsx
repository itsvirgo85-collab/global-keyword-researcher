"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { KeywordExplorer } from "@/components/KeywordExplorer";
import { SerpAnalyzerTab } from "@/components/SerpAnalyzerTab";
import { CompetitorSpyTab } from "@/components/CompetitorSpyTab";
import { AiBriefsTab } from "@/components/AiBriefsTab";
import { TopicClusteringTab } from "@/components/TopicClusteringTab";
import { CountryComparison } from "@/components/CountryComparison";
import { PseoMatrix } from "@/components/PseoMatrix";

export default function Home() {
  const [activeTab, setActiveTab] = useState("explorer");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "explorer" && <KeywordExplorer />}
        {activeTab === "serp" && <SerpAnalyzerTab />}
        {activeTab === "competitor" && <CompetitorSpyTab />}
        {activeTab === "brief" && <AiBriefsTab />}
        {activeTab === "clustering" && <TopicClusteringTab />}
        {activeTab === "comparison" && <CountryComparison />}
        {activeTab === "pseo" && <PseoMatrix />}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 transition-colors">
        <p>
          Global Keyword Intelligence Platform (v2.1 Pro) • Built with Next.js & Supabase PostgreSQL
        </p>
      </footer>
    </div>
  );
}
