# Global Keyword Intelligence Platform (v2.0)

A modern, free-first, worldwide multi-country and multilingual SEO keyword research platform inspired by Ahrefs and SEMrush.

## 🚀 Features Implemented

1. **Global Country & Language Engine:**
   - 100+ ISO 3166-1 country selection (US, UK, PK, IN, DE, FR, AE, SA, JP, BR, ZA, etc.)
   - Dynamic language selection with native RTL support for Urdu and Arabic
   - Authoritative Google Ads Geo Target IDs and local currencies
2. **Multi-Platform Keyword Suggestion Engine:**
   - **Google Autocomplete:** Recursive query tree harvesting (seed, questions, long-tail, modifiers)
   - **YouTube Autocomplete:** Video-specific tags, how-to tutorials, and topic ideas
   - **Amazon Suggest:** High-intent commercial and transactional buyer search queries
3. **Proprietary Organic Keyword Difficulty (KD) Engine (0–100):**
   - Evidence-based scoring using lexical density, word count, search intent, and commercial modifiers
   - Standardized bands: *Very Easy (0–10)*, *Easy (11–30)*, *Medium (31–50)*, *Hard (51–70)*, *Very Hard (71–100)*
4. **Opportunity Score (0–100):**
   - High-value keyword identification factoring in intent, specificity, and organic barrier
5. **1-Click AI SEO Content Brief Generator:**
   - Generates recommended word count, target H1, H2, and H3 outlines, FAQ schema questions, and semantic entities
6. **Google AI Overview (SGE) Detection:**
   - Evaluates search query characteristics to flag Zero-Click risk versus organic opportunity
7. **Global Country Comparison Matrix:**
   - Side-by-side market comparison across multiple countries simultaneously
8. **Programmatic SEO (pSEO) Matrix Generator:**
   - Generates 100+ variations with template syntax (e.g. `{tool}` and `{niche}`)
9. **Instant CSV Export:**
   - 1-click export of research tables preserving Unicode and multilingual text
10. **Supabase PostgreSQL Database:**
    - Full relational schema in `supabase/schema.sql` with Row Level Security (RLS) policies

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel / Node.js

## 💻 Getting Started

To run the application locally:

```bash
# Navigate to the project directory
cd C:\Users\dell\.gemini\antigravity\scratch\global-keyword-intelligence

# Start development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
