"""
API Routes for Market Intelligence Service
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from app.models.schemas import (
    MarketTestRequest,
    MarketTestResponse,
    BenchmarkRequest,
    BenchmarkResponse,
    TargetAudienceRequest,
    TargetAudienceResponse,
    SuccessResponse,
    ErrorResponse
)
from app.services.market_test_service import MarketTestService
from app.services.benchmark_service import BenchmarkService
from app.services.target_audience_service import TargetAudienceService
from app.core.database import get_db

logger = logging.getLogger(__name__)

router = APIRouter()


# ==================== Market Test Express ====================

@router.post(
    "/validation/market-test",
    response_model=MarketTestResponse,
    status_code=status.HTTP_200_OK,
    summary="Market Test Express",
    description="AI-powered market viability analysis with GPT-4"
)
async def create_market_test(
    request: MarketTestRequest,
    db: Session = Depends(get_db)
):
    """
    Perform comprehensive market analysis for a business idea.

    **Features:**
    - Viability scoring (0-100)
    - SWOT analysis
    - Market size estimation
    - Competition & risk assessment
    - AI-powered recommendations
    - Next steps guidance
    """
    try:
        service = MarketTestService(db)
        result = await service.analyze_market(request)
        return result

    except Exception as e:
        logger.error(f"Market test error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Market analysis failed: {str(e)}"
        )


@router.get(
    "/validation/market-test/history/{user_id}",
    response_model=List[dict],
    summary="Get Market Test History",
    description="Retrieve user's previous market tests"
)
async def get_market_test_history(
    user_id: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get user's market test history
    """
    try:
        service = MarketTestService(db)
        tests = await service.get_user_tests(user_id, limit)
        return tests

    except Exception as e:
        logger.error(f"History retrieval error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ==================== Benchmark Automático ====================

@router.post(
    "/validation/benchmark",
    response_model=BenchmarkResponse,
    status_code=status.HTTP_200_OK,
    summary="Benchmark Automático",
    description="Competitive intelligence analysis with web scraping + GPT-4"
)
async def create_benchmark_analysis(
    request: BenchmarkRequest,
    db: Session = Depends(get_db)
):
    """
    Perform comprehensive competitive benchmark analysis.

    **Features:**
    - Auto-discover competitors
    - Web scraping for competitor data
    - GPT-4 competitive analysis
    - Market gap identification
    - Differentiation strategies
    - Pricing recommendations
    - Industry trends & best practices
    """
    try:
        service = BenchmarkService(db)
        result = await service.analyze_competitors(request)
        return result

    except Exception as e:
        logger.error(f"Benchmark error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Benchmark analysis failed: {str(e)}"
        )


# ==================== Target Audience Generator ====================

@router.post(
    "/validation/target-audience",
    response_model=TargetAudienceResponse,
    status_code=status.HTTP_200_OK,
    summary="Generador de Público Objetivo",
    description="AI-powered target audience analysis with DALL-E personas"
)
async def generate_target_audience(
    request: TargetAudienceRequest,
    db: Session = Depends(get_db)
):
    """
    Generate comprehensive target audience analysis with visual personas.

    **Features:**
    - Detailed persona profiles (demographics, psychographics, behavior)
    - DALL-E 3 generated persona avatars
    - Audience segmentation
    - Market size estimation
    - Marketing channel recommendations
    - Messaging strategies
    - Engagement tactics
    """
    try:
        service = TargetAudienceService(db)
        result = await service.generate_audience_analysis(request)
        return result

    except Exception as e:
        logger.error(f"Target audience error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Target audience generation failed: {str(e)}"
        )


# ==================== Health Check ====================

@router.get(
    "/health",
    response_model=SuccessResponse,
    summary="Health Check",
    description="Service health check endpoint"
)
async def health_check():
    """
    Health check endpoint
    """
    return SuccessResponse(
        success=True,
        message="Market Intelligence Service is healthy",
        data={
            "service": "market-intelligence",
            "version": "1.0.0",
            "status": "operational"
        }
    )
