"""
Database models for Market Intelligence Service
"""
from sqlalchemy import Column, String, Float, Integer, DateTime, JSON, Text, Boolean, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

Base = declarative_base()


class MarketTest(Base):
    """Market test results table"""
    __tablename__ = "market_tests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), nullable=False, index=True)
    business_id = Column(String(100), nullable=True, index=True)

    # Input Data
    idea_description = Column(Text, nullable=False)
    target_market = Column(String(500), nullable=False)
    initial_investment = Column(Float, nullable=True)
    currency = Column(String(3), default="USD")
    country = Column(String(2), default="US")
    industry = Column(String(200), nullable=True, index=True)

    # Analysis Results
    viability_score = Column(Float, nullable=False)
    market_size = Column(String(50), nullable=False)
    market_size_description = Column(Text, nullable=True)
    competition_level = Column(String(50), nullable=False)
    risk_level = Column(String(50), nullable=False)

    # SWOT Analysis
    strengths = Column(JSONB, nullable=False)
    weaknesses = Column(JSONB, nullable=False)
    opportunities = Column(JSONB, nullable=False)
    threats = Column(JSONB, nullable=False)

    # Recommendations
    recommendations = Column(JSONB, nullable=False)
    next_steps = Column(JSONB, nullable=False)

    # Market Insights
    estimated_market_size_usd = Column(Float, nullable=True)
    estimated_startup_cost = Column(JSONB, nullable=True)
    revenue_potential = Column(Text, nullable=True)
    time_to_market = Column(String(200), nullable=True)

    # Meta
    gpt_model_used = Column(String(50), nullable=False)
    confidence_level = Column(Float, nullable=False)
    raw_gpt_response = Column(JSONB, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index('idx_user_created', 'user_id', 'created_at'),
        Index('idx_industry_viability', 'industry', 'viability_score'),
    )


class BenchmarkAnalysis(Base):
    """Competitive benchmark analysis table"""
    __tablename__ = "benchmark_analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), nullable=False, index=True)
    business_id = Column(String(100), nullable=True, index=True)

    # Input Data
    industry = Column(String(200), nullable=False, index=True)
    requested_competitors = Column(JSONB, nullable=True)
    auto_discover = Column(Boolean, default=True)
    country = Column(String(2), default="US")
    analysis_depth = Column(String(20), default="standard")

    # Results
    competitors_analyzed = Column(JSONB, nullable=False)
    total_competitors_found = Column(Integer, nullable=False)

    # Market Position
    market_gap_opportunities = Column(JSONB, nullable=False)
    differentiation_strategies = Column(JSONB, nullable=False)
    pricing_recommendations = Column(JSONB, nullable=True)

    # Insights
    industry_trends = Column(JSONB, nullable=False)
    best_practices = Column(JSONB, nullable=False)
    warnings = Column(JSONB, nullable=True)

    # Meta
    data_sources = Column(JSONB, nullable=False)
    confidence_level = Column(Float, nullable=False)
    scraping_success_rate = Column(Float, nullable=True)
    raw_data = Column(JSONB, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index('idx_user_industry', 'user_id', 'industry'),
        Index('idx_created', 'created_at'),
    )


class TargetAudience(Base):
    """Target audience analysis table"""
    __tablename__ = "target_audiences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), nullable=False, index=True)
    business_id = Column(String(100), nullable=True, index=True)

    # Input Data
    business_description = Column(Text, nullable=False)
    product_service = Column(Text, nullable=False)
    country = Column(String(2), default="US")

    # Personas
    personas = Column(JSONB, nullable=False)
    num_personas_generated = Column(Integer, nullable=False)

    # Segmentation
    primary_segment = Column(JSONB, nullable=False)
    secondary_segments = Column(JSONB, nullable=True)

    # Market Size
    estimated_audience_size = Column(String(200), nullable=True)
    addressable_market = Column(String(200), nullable=True)

    # Strategy
    marketing_channels = Column(JSONB, nullable=False)
    messaging_recommendations = Column(JSONB, nullable=False)
    engagement_tactics = Column(JSONB, nullable=False)

    # Meta
    confidence_level = Column(Float, nullable=False)
    dalle_images_generated = Column(Integer, default=0)
    raw_gpt_response = Column(JSONB, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index('idx_user_created', 'user_id', 'created_at'),
    )


class AnalysisCache(Base):
    """Cache table for expensive operations"""
    __tablename__ = "analysis_cache"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cache_key = Column(String(255), unique=True, nullable=False, index=True)
    cache_type = Column(String(50), nullable=False)  # market_test, benchmark, audience
    cached_data = Column(JSONB, nullable=False)
    hit_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)

    __table_args__ = (
        Index('idx_type_expires', 'cache_type', 'expires_at'),
    )
