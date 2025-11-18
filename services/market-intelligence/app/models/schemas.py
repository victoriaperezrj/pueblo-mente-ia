"""
Pydantic schemas for Market Intelligence Service
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class BusinessStage(str, Enum):
    """Business stage enumeration"""
    VALIDATION = "validation"
    OPERATING = "operating"
    CONSOLIDATED = "consolidated"
    GLOBAL = "global"


class MarketSize(str, Enum):
    """Market size classification"""
    NICHE = "niche"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    MASSIVE = "massive"


# ==================== Market Test Express ====================

class MarketTestRequest(BaseModel):
    """Request schema for market test"""
    user_id: str = Field(..., description="User ID")
    business_id: Optional[str] = Field(None, description="Business ID if exists")
    idea_description: str = Field(..., min_length=10, max_length=2000, description="Business idea description")
    target_market: str = Field(..., min_length=3, max_length=500, description="Target market description")
    initial_investment: Optional[float] = Field(None, ge=0, description="Initial investment amount")
    currency: str = Field(default="USD", description="Currency code")
    country: str = Field(default="US", description="Country code")
    industry: Optional[str] = Field(None, description="Industry/sector")

    @validator('idea_description')
    def validate_idea(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Idea description must be at least 10 characters')
        return v.strip()


class MarketTestResponse(BaseModel):
    """Response schema for market test"""
    test_id: str
    viability_score: float = Field(..., ge=0, le=100, description="Overall viability score (0-100)")
    market_size: MarketSize
    market_size_description: str
    competition_level: str = Field(..., description="Low/Medium/High")
    risk_level: str = Field(..., description="Low/Medium/High")

    # Detailed Analysis
    strengths: List[str] = Field(..., description="Key strengths")
    weaknesses: List[str] = Field(..., description="Key weaknesses")
    opportunities: List[str] = Field(..., description="Market opportunities")
    threats: List[str] = Field(..., description="Market threats")

    # Recommendations
    recommendations: List[str] = Field(..., description="AI-generated recommendations")
    next_steps: List[str] = Field(..., description="Suggested next steps")

    # Market Insights
    estimated_market_size_usd: Optional[float] = Field(None, description="Estimated market size in USD")
    estimated_startup_cost: Optional[Dict[str, float]] = Field(None, description="Cost breakdown")
    revenue_potential: Optional[str] = Field(None, description="Revenue potential description")
    time_to_market: Optional[str] = Field(None, description="Estimated time to market")

    # Meta
    analysis_date: datetime
    gpt_model_used: str
    confidence_level: float = Field(..., ge=0, le=1, description="AI confidence in analysis")


# ==================== Benchmark Automático ====================

class BenchmarkRequest(BaseModel):
    """Request schema for competitive benchmark"""
    user_id: str
    business_id: Optional[str] = None
    industry: str = Field(..., min_length=3, max_length=200)
    competitors: Optional[List[str]] = Field(None, max_items=10, description="Competitor URLs or names")
    auto_discover: bool = Field(default=True, description="Auto-discover competitors")
    country: str = Field(default="US")
    analysis_depth: str = Field(default="standard", description="quick/standard/deep")


class CompetitorAnalysis(BaseModel):
    """Individual competitor analysis"""
    name: str
    website: Optional[str] = None
    strengths: List[str]
    weaknesses: List[str]
    pricing_model: Optional[str] = None
    estimated_market_share: Optional[str] = None
    key_features: List[str]
    customer_sentiment: Optional[str] = None  # Positive/Neutral/Negative
    social_media_presence: Optional[Dict[str, Any]] = None


class BenchmarkResponse(BaseModel):
    """Response schema for benchmark analysis"""
    benchmark_id: str
    industry: str
    analysis_date: datetime

    # Competitors
    competitors_analyzed: List[CompetitorAnalysis]
    total_competitors_found: int

    # Market Position
    market_gap_opportunities: List[str]
    differentiation_strategies: List[str]
    pricing_recommendations: Dict[str, Any]

    # Insights
    industry_trends: List[str]
    best_practices: List[str]
    warnings: List[str]

    # Meta
    data_sources: List[str]
    confidence_level: float


# ==================== Generador de Público Objetivo ====================

class TargetAudienceRequest(BaseModel):
    """Request schema for target audience generation"""
    user_id: str
    business_id: Optional[str] = None
    business_description: str = Field(..., min_length=10, max_length=1000)
    product_service: str = Field(..., min_length=5, max_length=500)
    country: str = Field(default="US")
    generate_personas: bool = Field(default=True, description="Generate visual personas with DALL-E")
    num_personas: int = Field(default=3, ge=1, le=5, description="Number of personas to generate")


class PersonaProfile(BaseModel):
    """Individual persona profile"""
    persona_id: str
    name: str
    age_range: str
    occupation: str
    income_level: str
    location: str

    # Psychographics
    interests: List[str]
    values: List[str]
    pain_points: List[str]
    goals: List[str]

    # Behavior
    buying_behavior: str
    preferred_channels: List[str]
    decision_factors: List[str]

    # Engagement
    communication_style: str
    content_preferences: List[str]

    # Visual
    avatar_url: Optional[str] = Field(None, description="DALL-E generated avatar URL")
    avatar_description: str


class TargetAudienceResponse(BaseModel):
    """Response schema for target audience"""
    audience_id: str
    analysis_date: datetime

    # Personas
    personas: List[PersonaProfile]

    # Segmentation
    primary_segment: Dict[str, Any]
    secondary_segments: List[Dict[str, Any]]

    # Market Size
    estimated_audience_size: Optional[str] = None
    addressable_market: Optional[str] = None

    # Strategy
    marketing_channels: List[str]
    messaging_recommendations: List[str]
    engagement_tactics: List[str]

    # Meta
    confidence_level: float


# ==================== Common ====================

class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SuccessResponse(BaseModel):
    """Generic success response"""
    success: bool = True
    message: str
    data: Optional[Dict[str, Any]] = None
