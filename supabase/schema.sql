-- Global Keyword Intelligence Platform (Supabase PostgreSQL Migration Schema)
-- Version: 2.0 (Includes AI Briefs, pSEO Matrices, Multi-Platform & RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. COUNTRIES TABLE
CREATE TABLE IF NOT EXISTS public.countries (
    iso_code VARCHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    flag VARCHAR(10) NOT NULL,
    region VARCHAR(50) NOT NULL,
    default_language VARCHAR(10) NOT NULL,
    supported_languages JSONB NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    google_geo_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. KEYWORDS TABLE
CREATE TABLE IF NOT EXISTS public.keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword_text TEXT NOT NULL,
    normalized_text TEXT NOT NULL,
    country_code VARCHAR(2) REFERENCES public.countries(iso_code) ON DELETE RESTRICT,
    language_code VARCHAR(10) NOT NULL,
    platform VARCHAR(20) DEFAULT 'google',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(keyword_text, country_code, language_code, platform)
);

CREATE INDEX IF NOT EXISTS idx_keywords_lookup ON public.keywords(normalized_text, country_code, language_code);

-- 4. KEYWORD METRICS TABLE
CREATE TABLE IF NOT EXISTS public.keyword_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword_id UUID REFERENCES public.keywords(id) ON DELETE CASCADE,
    search_volume INT,
    cpc NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    paid_competition NUMERIC(5,2),
    keyword_difficulty INT CHECK (keyword_difficulty BETWEEN 0 AND 100),
    kd_band VARCHAR(20),
    search_intent VARCHAR(20),
    opportunity_score INT CHECK (opportunity_score BETWEEN 0 AND 100),
    trend_score INT,
    has_ai_overview BOOLEAN DEFAULT FALSE,
    clicks_potential NUMERIC(5,2),
    provider VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    retrieved_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metrics_keyword ON public.keyword_metrics(keyword_id);

-- 5. AI CONTENT BRIEFS TABLE
CREATE TABLE IF NOT EXISTS public.content_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword_id UUID REFERENCES public.keywords(id) ON DELETE CASCADE,
    recommended_min_words INT,
    recommended_max_words INT,
    target_headings JSONB NOT NULL,
    frequently_asked_questions JSONB NOT NULL,
    nlp_entities JSONB NOT NULL,
    suggested_angle VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER SAVED PROJECTS & KEYWORD LISTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES public.keywords(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, keyword_id)
);

-- 7. PROGRAMMATIC SEO MATRICES
CREATE TABLE IF NOT EXISTS public.pseo_matrices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    pattern_template TEXT NOT NULL,
    generated_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pseo_matrices ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reference tables and research
CREATE POLICY "Public read access for countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Public read access for keywords" ON public.keywords FOR SELECT USING (true);
CREATE POLICY "Public read access for keyword_metrics" ON public.keyword_metrics FOR SELECT USING (true);
CREATE POLICY "Public read access for content_briefs" ON public.content_briefs FOR SELECT USING (true);
