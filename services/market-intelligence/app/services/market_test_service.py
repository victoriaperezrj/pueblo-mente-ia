"""
Market Test Express Service
AI-powered market viability analysis
"""
import json
import hashlib
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import openai
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.schemas import (
    MarketTestRequest,
    MarketTestResponse,
    MarketSize
)
from app.models.database import MarketTest, AnalysisCache
import logging

logger = logging.getLogger(__name__)


class MarketTestService:
    """Service for market viability testing"""

    def __init__(self, db: Session):
        self.db = db
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

    async def analyze_market(self, request: MarketTestRequest) -> MarketTestResponse:
        """
        Perform comprehensive market analysis using GPT-4
        """
        try:
            # Check cache first
            if settings.ENABLE_CACHING:
                cached_result = self._get_from_cache(request)
                if cached_result:
                    logger.info(f"Cache hit for market test: {request.idea_description[:50]}")
                    return cached_result

            # Prepare GPT-4 prompt
            prompt = self._build_analysis_prompt(request)

            # Call GPT-4
            logger.info(f"Calling GPT-4 for market analysis: {request.user_id}")
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": self._get_system_prompt()
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=settings.OPENAI_TEMPERATURE,
                max_tokens=settings.OPENAI_MAX_TOKENS,
                response_format={"type": "json_object"}
            )

            # Parse response
            analysis_data = json.loads(response.choices[0].message.content)
            logger.info(f"GPT-4 analysis completed. Viability score: {analysis_data.get('viability_score')}")

            # Create response object
            test_response = self._create_response(request, analysis_data, response.model)

            # Save to database
            self._save_to_database(request, analysis_data, response.model)

            # Cache result
            if settings.ENABLE_CACHING:
                self._save_to_cache(request, test_response)

            return test_response

        except openai.APIError as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise Exception(f"AI analysis failed: {str(e)}")
        except Exception as e:
            logger.error(f"Market analysis error: {str(e)}")
            raise

    def _get_system_prompt(self) -> str:
        """Get system prompt for GPT-4"""
        return """You are an expert business consultant and market analyst with deep expertise in:
- Market viability assessment
- Competitive analysis
- Business model evaluation
- Financial feasibility
- Risk assessment
- Strategic planning

Your task is to analyze business ideas and provide comprehensive, data-driven insights.
Be objective, realistic, and actionable in your recommendations.

CRITICAL: You must respond with valid JSON only. Use this exact structure:
{
  "viability_score": <float 0-100>,
  "market_size": "<niche|small|medium|large|massive>",
  "market_size_description": "<detailed description>",
  "competition_level": "<Low|Medium|High>",
  "risk_level": "<Low|Medium|High>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "opportunities": ["<opportunity 1>", "<opportunity 2>", ...],
  "threats": ["<threat 1>", "<threat 2>", ...],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", ...],
  "next_steps": ["<step 1>", "<step 2>", ...],
  "estimated_market_size_usd": <float or null>,
  "estimated_startup_cost": {
    "minimum": <float>,
    "realistic": <float>,
    "optimal": <float>,
    "breakdown": {
      "<category>": <float>,
      ...
    }
  },
  "revenue_potential": "<description>",
  "time_to_market": "<estimate>",
  "confidence_level": <float 0-1>
}"""

    def _build_analysis_prompt(self, request: MarketTestRequest) -> str:
        """Build detailed analysis prompt"""
        prompt = f"""Analyze this business idea for market viability:

**Business Idea:**
{request.idea_description}

**Target Market:**
{request.target_market}

**Country/Region:**
{request.country}

**Industry:**
{request.industry or "Not specified"}

**Initial Investment Available:**
{f"${request.initial_investment:,.2f} {request.currency}" if request.initial_investment else "Not specified"}

Please provide a comprehensive analysis including:

1. **Viability Score (0-100)**: Overall assessment of business potential
2. **Market Size**: Classification and detailed description
3. **Competition Analysis**: Level and key competitors
4. **SWOT Analysis**:
   - Strengths (4-6 points)
   - Weaknesses (4-6 points)
   - Opportunities (4-6 points)
   - Threats (4-6 points)
5. **Strategic Recommendations**: 5-8 actionable recommendations
6. **Next Steps**: 5-7 immediate action items
7. **Financial Projections**:
   - Estimated market size in USD
   - Startup cost breakdown (minimum, realistic, optimal)
   - Revenue potential assessment
8. **Time to Market**: Realistic timeline estimate
9. **Risk Assessment**: Overall risk level with key risk factors

Consider current market trends, economic conditions, technological disruption, regulatory environment, and competitive dynamics for {request.country}.

Respond with valid JSON only."""

        return prompt

    def _create_response(
        self,
        request: MarketTestRequest,
        analysis_data: Dict[str, Any],
        model_used: str
    ) -> MarketTestResponse:
        """Create response object from analysis data"""

        return MarketTestResponse(
            test_id=str(self.db.query(MarketTest)
                       .filter(MarketTest.user_id == request.user_id)
                       .count() + 1),
            viability_score=float(analysis_data.get("viability_score", 0)),
            market_size=MarketSize(analysis_data.get("market_size", "medium").lower()),
            market_size_description=analysis_data.get("market_size_description", ""),
            competition_level=analysis_data.get("competition_level", "Medium"),
            risk_level=analysis_data.get("risk_level", "Medium"),
            strengths=analysis_data.get("strengths", []),
            weaknesses=analysis_data.get("weaknesses", []),
            opportunities=analysis_data.get("opportunities", []),
            threats=analysis_data.get("threats", []),
            recommendations=analysis_data.get("recommendations", []),
            next_steps=analysis_data.get("next_steps", []),
            estimated_market_size_usd=analysis_data.get("estimated_market_size_usd"),
            estimated_startup_cost=analysis_data.get("estimated_startup_cost"),
            revenue_potential=analysis_data.get("revenue_potential"),
            time_to_market=analysis_data.get("time_to_market"),
            analysis_date=datetime.utcnow(),
            gpt_model_used=model_used,
            confidence_level=float(analysis_data.get("confidence_level", 0.7))
        )

    def _save_to_database(
        self,
        request: MarketTestRequest,
        analysis_data: Dict[str, Any],
        model_used: str
    ):
        """Save analysis to database"""
        try:
            market_test = MarketTest(
                user_id=request.user_id,
                business_id=request.business_id,
                idea_description=request.idea_description,
                target_market=request.target_market,
                initial_investment=request.initial_investment,
                currency=request.currency,
                country=request.country,
                industry=request.industry,
                viability_score=float(analysis_data.get("viability_score", 0)),
                market_size=analysis_data.get("market_size", "medium"),
                market_size_description=analysis_data.get("market_size_description", ""),
                competition_level=analysis_data.get("competition_level", "Medium"),
                risk_level=analysis_data.get("risk_level", "Medium"),
                strengths=analysis_data.get("strengths", []),
                weaknesses=analysis_data.get("weaknesses", []),
                opportunities=analysis_data.get("opportunities", []),
                threats=analysis_data.get("threats", []),
                recommendations=analysis_data.get("recommendations", []),
                next_steps=analysis_data.get("next_steps", []),
                estimated_market_size_usd=analysis_data.get("estimated_market_size_usd"),
                estimated_startup_cost=analysis_data.get("estimated_startup_cost"),
                revenue_potential=analysis_data.get("revenue_potential"),
                time_to_market=analysis_data.get("time_to_market"),
                gpt_model_used=model_used,
                confidence_level=float(analysis_data.get("confidence_level", 0.7)),
                raw_gpt_response=analysis_data
            )

            self.db.add(market_test)
            self.db.commit()
            logger.info(f"Market test saved to database for user: {request.user_id}")

        except Exception as e:
            logger.error(f"Database save error: {str(e)}")
            self.db.rollback()
            raise

    def _get_cache_key(self, request: MarketTestRequest) -> str:
        """Generate cache key from request"""
        key_string = f"{request.idea_description}:{request.target_market}:{request.country}:{request.industry}"
        return hashlib.md5(key_string.encode()).hexdigest()

    def _get_from_cache(self, request: MarketTestRequest) -> Optional[MarketTestResponse]:
        """Get analysis from cache if available"""
        try:
            cache_key = self._get_cache_key(request)
            cached = self.db.query(AnalysisCache).filter(
                AnalysisCache.cache_key == cache_key,
                AnalysisCache.cache_type == "market_test",
                AnalysisCache.expires_at > datetime.utcnow()
            ).first()

            if cached:
                # Update hit count
                cached.hit_count += 1
                self.db.commit()

                # Return cached data
                data = cached.cached_data
                return MarketTestResponse(**data)

            return None

        except Exception as e:
            logger.error(f"Cache retrieval error: {str(e)}")
            return None

    def _save_to_cache(self, request: MarketTestRequest, response: MarketTestResponse):
        """Save analysis to cache"""
        try:
            cache_key = self._get_cache_key(request)

            # Delete existing cache entry
            self.db.query(AnalysisCache).filter(
                AnalysisCache.cache_key == cache_key
            ).delete()

            # Create new cache entry
            cache_entry = AnalysisCache(
                cache_key=cache_key,
                cache_type="market_test",
                cached_data=response.model_dump(),
                expires_at=datetime.utcnow() + timedelta(seconds=settings.CACHE_TTL)
            )

            self.db.add(cache_entry)
            self.db.commit()
            logger.info(f"Analysis cached with key: {cache_key}")

        except Exception as e:
            logger.error(f"Cache save error: {str(e)}")
            self.db.rollback()

    async def get_user_tests(self, user_id: str, limit: int = 10) -> list:
        """Get user's previous market tests"""
        try:
            tests = self.db.query(MarketTest).filter(
                MarketTest.user_id == user_id
            ).order_by(
                MarketTest.created_at.desc()
            ).limit(limit).all()

            return [
                {
                    "id": str(test.id),
                    "idea_description": test.idea_description[:100] + "...",
                    "viability_score": test.viability_score,
                    "market_size": test.market_size,
                    "created_at": test.created_at.isoformat(),
                }
                for test in tests
            ]

        except Exception as e:
            logger.error(f"Error fetching user tests: {str(e)}")
            return []
