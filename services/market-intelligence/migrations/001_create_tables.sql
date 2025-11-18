-- Market Intelligence Service Database Migrations
-- Version: 001
-- Description: Create initial tables for market intelligence features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Market Tests Table
CREATE TABLE IF NOT EXISTS market_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    business_id VARCHAR(100),

    -- Input Data
    idea_description TEXT NOT NULL,
    target_market VARCHAR(500) NOT NULL,
    initial_investment DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    country VARCHAR(2) DEFAULT 'US',
    industry VARCHAR(200),

    -- Analysis Results
    viability_score DECIMAL(5, 2) NOT NULL CHECK (viability_score >= 0 AND viability_score <= 100),
    market_size VARCHAR(50) NOT NULL,
    market_size_description TEXT,
    competition_level VARCHAR(50) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,

    -- SWOT Analysis (stored as JSONB for flexibility)
    strengths JSONB NOT NULL DEFAULT '[]',
    weaknesses JSONB NOT NULL DEFAULT '[]',
    opportunities JSONB NOT NULL DEFAULT '[]',
    threats JSONB NOT NULL DEFAULT '[]',

    -- Recommendations
    recommendations JSONB NOT NULL DEFAULT '[]',
    next_steps JSONB NOT NULL DEFAULT '[]',

    -- Market Insights
    estimated_market_size_usd DECIMAL(15, 2),
    estimated_startup_cost JSONB,
    revenue_potential TEXT,
    time_to_market VARCHAR(200),

    -- Meta
    gpt_model_used VARCHAR(50) NOT NULL,
    confidence_level DECIMAL(3, 2) NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 1),
    raw_gpt_response JSONB,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for market_tests
CREATE INDEX idx_market_tests_user_id ON market_tests(user_id);
CREATE INDEX idx_market_tests_business_id ON market_tests(business_id);
CREATE INDEX idx_market_tests_user_created ON market_tests(user_id, created_at DESC);
CREATE INDEX idx_market_tests_industry_viability ON market_tests(industry, viability_score DESC);
CREATE INDEX idx_market_tests_created_at ON market_tests(created_at DESC);

-- Benchmark Analyses Table
CREATE TABLE IF NOT EXISTS benchmark_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    business_id VARCHAR(100),

    -- Input Data
    industry VARCHAR(200) NOT NULL,
    requested_competitors JSONB,
    auto_discover BOOLEAN DEFAULT TRUE,
    country VARCHAR(2) DEFAULT 'US',
    analysis_depth VARCHAR(20) DEFAULT 'standard',

    -- Results
    competitors_analyzed JSONB NOT NULL DEFAULT '[]',
    total_competitors_found INTEGER NOT NULL DEFAULT 0,

    -- Market Position
    market_gap_opportunities JSONB NOT NULL DEFAULT '[]',
    differentiation_strategies JSONB NOT NULL DEFAULT '[]',
    pricing_recommendations JSONB,

    -- Insights
    industry_trends JSONB NOT NULL DEFAULT '[]',
    best_practices JSONB NOT NULL DEFAULT '[]',
    warnings JSONB,

    -- Meta
    data_sources JSONB NOT NULL DEFAULT '[]',
    confidence_level DECIMAL(3, 2) NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 1),
    scraping_success_rate DECIMAL(3, 2),
    raw_data JSONB,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for benchmark_analyses
CREATE INDEX idx_benchmark_analyses_user_id ON benchmark_analyses(user_id);
CREATE INDEX idx_benchmark_analyses_business_id ON benchmark_analyses(business_id);
CREATE INDEX idx_benchmark_analyses_industry ON benchmark_analyses(industry);
CREATE INDEX idx_benchmark_analyses_user_industry ON benchmark_analyses(user_id, industry);
CREATE INDEX idx_benchmark_analyses_created_at ON benchmark_analyses(created_at DESC);

-- Target Audiences Table
CREATE TABLE IF NOT EXISTS target_audiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    business_id VARCHAR(100),

    -- Input Data
    business_description TEXT NOT NULL,
    product_service TEXT NOT NULL,
    country VARCHAR(2) DEFAULT 'US',

    -- Personas
    personas JSONB NOT NULL DEFAULT '[]',
    num_personas_generated INTEGER NOT NULL DEFAULT 0,

    -- Segmentation
    primary_segment JSONB NOT NULL,
    secondary_segments JSONB,

    -- Market Size
    estimated_audience_size VARCHAR(200),
    addressable_market VARCHAR(200),

    -- Strategy
    marketing_channels JSONB NOT NULL DEFAULT '[]',
    messaging_recommendations JSONB NOT NULL DEFAULT '[]',
    engagement_tactics JSONB NOT NULL DEFAULT '[]',

    -- Meta
    confidence_level DECIMAL(3, 2) NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 1),
    dalle_images_generated INTEGER DEFAULT 0,
    raw_gpt_response JSONB,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for target_audiences
CREATE INDEX idx_target_audiences_user_id ON target_audiences(user_id);
CREATE INDEX idx_target_audiences_business_id ON target_audiences(business_id);
CREATE INDEX idx_target_audiences_user_created ON target_audiences(user_id, created_at DESC);
CREATE INDEX idx_target_audiences_created_at ON target_audiences(created_at DESC);

-- Analysis Cache Table
CREATE TABLE IF NOT EXISTS analysis_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    cache_type VARCHAR(50) NOT NULL,
    cached_data JSONB NOT NULL,
    hit_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for analysis_cache
CREATE INDEX idx_analysis_cache_key ON analysis_cache(cache_key);
CREATE INDEX idx_analysis_cache_type_expires ON analysis_cache(cache_type, expires_at);
CREATE INDEX idx_analysis_cache_expires ON analysis_cache(expires_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_market_tests_updated_at
    BEFORE UPDATE ON market_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_benchmark_analyses_updated_at
    BEFORE UPDATE ON benchmark_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_target_audiences_updated_at
    BEFORE UPDATE ON target_audiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Clean up expired cache entries (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM analysis_cache
    WHERE expires_at < NOW();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Insert test data (optional, for development)
-- INSERT INTO market_tests (
--     user_id, idea_description, target_market, viability_score,
--     market_size, competition_level, risk_level,
--     strengths, weaknesses, opportunities, threats,
--     recommendations, next_steps, gpt_model_used, confidence_level
-- ) VALUES (
--     'test-user-1',
--     'AI-powered meal planning app for busy professionals',
--     'Urban professionals aged 25-45 with disposable income',
--     78.5,
--     'medium',
--     'High',
--     'Medium',
--     '["Solves real pain point", "Large target market", "Recurring revenue potential"]'::jsonb,
--     '["Competitive market", "Requires marketing budget"]'::jsonb,
--     '["Partner with gyms", "B2B corporate wellness", "Meal kit integration"]'::jsonb,
--     '["Established competitors", "Changing consumer preferences"]'::jsonb,
--     '["Start with MVP", "Focus on one niche", "Build community"]'::jsonb,
--     '["Validate with 100 beta users", "Develop core app", "Secure seed funding"]'::jsonb,
--     'gpt-4-turbo-preview',
--     0.85
-- );
