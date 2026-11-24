"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { KeywordExplorer } from "@/components/KeywordExplorer";
import { CountryComparison } from "@/components/CountryComparison";
import { PseoMatrix } from "@/components/PseoMatrix";
import { AiBriefsTab } from "@/components/AiBriefsTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState("explorer");

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "explorer" && <KeywordExplorer />}
        {activeTab === "comparison" && <CountryComparison />}
        {activeTab === "brief" && <AiBriefsTab />}
        {activeTab === "pseo" && <PseoMatrix />}
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>
          Global Keyword Intelligence Platform (v2.0 Extended) • Built with Next.js & Supabase PostgreSQL
        </p>
      </footer>
    </div>
  );
}
