export interface Country {
  code: string; // ISO 3166-1 alpha-2 (e.g. US, PK, GB)
  name: string;
  flag: string;
  region: 'North America' | 'Europe' | 'Asia' | 'Oceania' | 'Africa' | 'South America' | 'Middle East';
  defaultLanguage: string;
  supportedLanguages: { code: string; name: string; isRTL?: boolean }[];
  currency: {
    code: string;
    symbol: string;
  };
  googleGeoId?: number;
}

export type SearchIntent = 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';

export type KeywordDifficultyBand = 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

export type SearchPlatform = 'google' | 'youtube' | 'amazon';

export interface KeywordMetric {
  keyword: string;
  country: string;
  language: string;
  platform: SearchPlatform;
  searchVolume: number | null; // null if not yet queried/available from paid provider
  cpc: number | null;
  currency: string;
  paidCompetition: number | null; // 0 to 1 scale or percentage
  keywordDifficulty: number; // 0 to 100
  kdBand: KeywordDifficultyBand;
  searchIntent: SearchIntent;
  opportunityScore: number; // 0 to 100
  trendScore?: number; // 0 to 100 relative trend interest
  hasAiOverview?: boolean;
  clicksPotential?: number; // Estimated % of clicks reaching organic results
  provider: string;
  isVerified: boolean;
  sourceType: 'Autocomplete Tree' | 'Google Trends' | 'Google Ads API' | 'Algorithmic Model';
}

export interface KeywordSuggestion {
  keyword: string;
  type: 'matching' | 'questions' | 'long-tail' | 'related' | 'high-intent';
  platform: SearchPlatform;
  wordCount: number;
  intent: SearchIntent;
  estimatedKd: number;
  kdBand: KeywordDifficultyBand;
  opportunityScore: number;
}

export interface ContentBrief {
  keyword: string;
  country: string;
  language: string;
  recommendedWordCount: { min: number; max: number };
  targetHeadings: {
    h1: string;
    h2: string[];
    h3: string[];
  };
  frequentlyAskedQuestions: string[];
  nlpEntities: string[];
  suggestedAngle: 'Comprehensive Guide' | 'Top Listicle' | 'Comparison / Review' | 'Step-by-Step Tutorial';
}

export interface SERPResultItem {
  position: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  estimatedAuthority: number; // 0-100
}
