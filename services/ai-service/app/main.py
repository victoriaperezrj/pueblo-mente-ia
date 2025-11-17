"""
AI Service - FastAPI Microservice
Handles all AI/ML operations including:
- Idea validation with LLMs
- Financial forecasting
- Market analysis
- Strategic planning insights
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import logging
from prometheus_fastapi_instrumentator import Instrumentator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Pueblo Mente IA - AI Service",
    description="Microservice for AI/ML operations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Pydantic models
class IdeaValidationRequest(BaseModel):
    idea_description: str = Field(..., min_length=50, max_length=2000)
    answers: List[str] = Field(..., min_items=4, max_items=4)
    user_id: Optional[str] = None

class IdeaValidationResponse(BaseModel):
    viability_score: int = Field(..., ge=0, le=100)
    breakdown: Dict[str, int]
    recommendations: List[str]
    next_steps: List[str]
    timestamp: datetime

class FinancialSimulationRequest(BaseModel):
    initial_investment: float = Field(..., ge=0)
    monthly_revenue: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)
    growth_rate: float = Field(..., ge=0, le=100)
    months: int = Field(default=12, ge=1, le=60)

class FinancialProjection(BaseModel):
    month: int
    revenue: float
    expenses: float
    balance: float
    profit: float

class FinancialSimulationResponse(BaseModel):
    projections: List[FinancialProjection]
    break_even_month: int
    final_balance: float
    insights: List[str]
    timestamp: datetime

class MarketAnalysisRequest(BaseModel):
    industry: str
    location: str
    company_size: str
    target_audience: Optional[str] = None

class MarketAnalysisResponse(BaseModel):
    market_size: Dict[str, Any]
    competitors: List[Dict[str, Any]]
    trends: List[Dict[str, Any]]
    opportunities: List[Dict[str, Any]]
    threats: List[str]
    timestamp: datetime

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    service: str
    version: str

# Health check endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for Kubernetes probes"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        service="ai-service",
        version="1.0.0"
    )

@app.get("/ready", response_model=HealthResponse)
async def readiness_check():
    """Readiness check endpoint"""
    # TODO: Check AI model availability, database connections, etc.
    return HealthResponse(
        status="ready",
        timestamp=datetime.now(),
        service="ai-service",
        version="1.0.0"
    )

# AI endpoints
@app.post("/api/v1/ai/validate-idea", response_model=IdeaValidationResponse)
async def validate_idea(request: IdeaValidationRequest):
    """
    Validate a business idea using AI analysis
    Simulates Shark Tank-style validation with 4 key questions
    """
    try:
        logger.info(f"Processing idea validation for user: {request.user_id}")

        # TODO: Integrate with OpenAI/Gemini API
        # For now, return mock data

        # Simulate AI analysis
        breakdown = {
            "problema_real": 85,
            "tamano_mercado": 70,
            "ventaja_competitiva": 60,
            "monetizacion": 75
        }

        viability_score = sum(breakdown.values()) // len(breakdown)

        recommendations = [
            "Habla con 20 potenciales clientes esta semana",
            "Crea un landing page en 2 días con Carrd o Webflow",
            "Invierte $50 USD en ads para testear interés real"
        ]

        next_steps = [
            "Validar supuestos con datos reales del mercado",
            "Construir MVP en 30 días máximo",
            "Conseguir primeros 10 clientes de pago"
        ]

        return IdeaValidationResponse(
            viability_score=viability_score,
            breakdown=breakdown,
            recommendations=recommendations,
            next_steps=next_steps,
            timestamp=datetime.now()
        )

    except Exception as e:
        logger.error(f"Error in idea validation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ai/financial-simulation", response_model=FinancialSimulationResponse)
async def financial_simulation(request: FinancialSimulationRequest):
    """
    Run financial projections based on input parameters
    Uses ML models to predict future performance
    """
    try:
        logger.info(f"Running financial simulation for {request.months} months")

        projections = []
        revenue = request.monthly_revenue
        expenses = request.monthly_expenses
        balance = -request.initial_investment
        break_even_month = -1

        for month in range(request.months + 1):
            profit = revenue - expenses
            balance += profit

            projections.append(FinancialProjection(
                month=month,
                revenue=round(revenue, 2),
                expenses=round(expenses, 2),
                balance=round(balance, 2),
                profit=round(profit, 2)
            ))

            if break_even_month == -1 and balance >= 0:
                break_even_month = month

            # Apply growth
            revenue *= (1 + request.growth_rate / 100)
            expenses *= 1.02  # 2% monthly expense growth

        # Generate insights
        insights = []
        if break_even_month > 0:
            insights.append(f"Alcanzarás break-even en {break_even_month} meses")
        else:
            insights.append("No alcanzarás break-even en el período proyectado")

        if balance > 0:
            insights.append(f"Balance positivo de ${round(balance, 2)} al final del período")
        else:
            insights.append(f"Necesitarás capital adicional: ${abs(round(balance, 2))}")

        return FinancialSimulationResponse(
            projections=projections,
            break_even_month=break_even_month if break_even_month > 0 else request.months,
            final_balance=round(balance, 2),
            insights=insights,
            timestamp=datetime.now()
        )

    except Exception as e:
        logger.error(f"Error in financial simulation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ai/market-analysis", response_model=MarketAnalysisResponse)
async def market_analysis(request: MarketAnalysisRequest):
    """
    Perform AI-powered market analysis
    Analyzes competition, trends, and opportunities
    """
    try:
        logger.info(f"Running market analysis for {request.industry} in {request.location}")

        # TODO: Integrate with real market data APIs and AI analysis
        # For now, return mock data

        market_size = {
            "tam": "$10B",
            "sam": "$500M",
            "som": "$50M",
            "growth_rate": "15%"
        }

        competitors = [
            {"name": "Competitor A", "market_share": "25%", "strength": "Brand recognition"},
            {"name": "Competitor B", "market_share": "18%", "strength": "Pricing"},
            {"name": "Competitor C", "market_share": "12%", "strength": "Technology"}
        ]

        trends = [
            {"trend": "Digital transformation", "relevance": "high", "impact": 8},
            {"trend": "AI adoption", "relevance": "very high", "impact": 9},
            {"trend": "Remote work", "relevance": "medium", "impact": 6}
        ]

        opportunities = [
            {"opportunity": "Underserved SMB segment", "score": 8, "timeframe": "6 months"},
            {"opportunity": "Geographic expansion", "score": 7, "timeframe": "12 months"}
        ]

        threats = [
            "Increasing competition from well-funded startups",
            "Regulatory changes in data privacy",
            "Economic downturn affecting B2B spending"
        ]

        return MarketAnalysisResponse(
            market_size=market_size,
            competitors=competitors,
            trends=trends,
            opportunities=opportunities,
            threats=threats,
            timestamp=datetime.now()
        )

    except Exception as e:
        logger.error(f"Error in market analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "Pueblo Mente IA - AI Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
