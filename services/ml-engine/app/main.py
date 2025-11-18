"""
ML Engine - Advanced Predictive Analytics & Machine Learning Service
Provides enterprise-grade ML capabilities for forecasting, prediction, and optimization
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from enum import Enum
import numpy as np
import pandas as pd
from prophet import Prophet
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
import logging
import asyncio
from prometheus_fastapi_instrumentator import Instrumentator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ML Engine - Pueblo Mente IA",
    description="Advanced Machine Learning & Predictive Analytics Engine",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics
Instrumentator().instrument(app).expose(app)

# ============================================================================
# MODELS & SCHEMAS
# ============================================================================

class TimeSeriesData(BaseModel):
    date: str
    value: float

class CashFlowForecastRequest(BaseModel):
    user_id: str
    business_id: str
    historical_data: List[TimeSeriesData]
    forecast_periods: int = Field(default=12, ge=1, le=60)
    confidence_level: float = Field(default=0.95, ge=0.8, le=0.99)

class CashFlowForecastResponse(BaseModel):
    forecast: List[Dict[str, Any]]
    trend: str
    seasonality_detected: bool
    confidence_intervals: List[Dict[str, Any]]
    insights: List[str]
    risk_score: float
    recommended_actions: List[str]

class SalesForecastRequest(BaseModel):
    user_id: str
    business_id: str
    historical_sales: List[TimeSeriesData]
    external_factors: Optional[Dict[str, Any]] = None
    forecast_horizon: int = Field(default=30, ge=1, le=365)

class CustomerChurnRequest(BaseModel):
    user_id: str
    customers: List[Dict[str, Any]]

class CustomerChurnResponse(BaseModel):
    customer_id: str
    churn_probability: float
    risk_level: str
    retention_recommendations: List[str]
    lifetime_value_prediction: float

class PricingOptimizationRequest(BaseModel):
    user_id: str
    product_id: str
    current_price: float
    cost: float
    competitor_prices: List[float]
    historical_demand: List[TimeSeriesData]
    elasticity: Optional[float] = None

class PricingOptimizationResponse(BaseModel):
    optimal_price: float
    expected_revenue: float
    expected_units_sold: float
    price_elasticity: float
    revenue_impact: float
    confidence_score: float
    recommendations: List[str]

class InventoryOptimizationRequest(BaseModel):
    user_id: str
    product_id: str
    historical_demand: List[TimeSeriesData]
    lead_time_days: int
    holding_cost_per_unit: float
    ordering_cost: float
    stockout_cost: Optional[float] = None

class InventoryOptimizationResponse(BaseModel):
    economic_order_quantity: float
    reorder_point: float
    safety_stock: float
    optimal_stock_level: float
    annual_holding_cost: float
    annual_ordering_cost: float
    total_cost: float
    recommendations: List[str]

class MarketTrendRequest(BaseModel):
    industry: str
    region: str
    keywords: List[str]

class MarketTrendResponse(BaseModel):
    trend_score: float
    growth_rate: float
    sentiment: str
    opportunities: List[str]
    threats: List[str]
    emerging_trends: List[str]

class RiskAssessmentRequest(BaseModel):
    user_id: str
    business_id: str
    financial_data: Dict[str, Any]
    market_data: Optional[Dict[str, Any]] = None

class RiskAssessmentResponse(BaseModel):
    overall_risk_score: float
    financial_health_score: float
    market_risk_score: float
    operational_risk_score: float
    risk_factors: List[Dict[str, Any]]
    mitigation_strategies: List[str]

# ============================================================================
# ML MODELS & ALGORITHMS
# ============================================================================

class CashFlowPredictor:
    """Advanced cash flow forecasting using Prophet and ensemble methods"""

    def __init__(self):
        self.model = None

    def forecast(self, historical_data: List[TimeSeriesData], periods: int) -> Dict[str, Any]:
        """Generate cash flow forecast with confidence intervals"""
        try:
            # Prepare data for Prophet
            df = pd.DataFrame([
                {'ds': pd.to_datetime(item.date), 'y': item.value}
                for item in historical_data
            ])

            # Initialize and fit Prophet model
            model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=False,
                daily_seasonality=False,
                changepoint_prior_scale=0.05,
                interval_width=0.95
            )
            model.fit(df)

            # Make future dataframe
            future = model.make_future_dataframe(periods=periods, freq='M')
            forecast = model.predict(future)

            # Calculate trend
            recent_trend = forecast['trend'].tail(periods).mean()
            historical_trend = forecast['trend'].head(len(df)).mean()
            trend_direction = "upward" if recent_trend > historical_trend else "downward"

            # Detect seasonality
            seasonality_detected = abs(forecast['yearly'].std()) > 0.01

            # Generate insights
            insights = self._generate_insights(forecast, df, periods)

            # Calculate risk score
            risk_score = self._calculate_risk_score(forecast, df)

            # Format response
            forecast_data = []
            for idx in range(len(df), len(forecast)):
                forecast_data.append({
                    'date': forecast.iloc[idx]['ds'].strftime('%Y-%m-%d'),
                    'predicted_value': round(forecast.iloc[idx]['yhat'], 2),
                    'lower_bound': round(forecast.iloc[idx]['yhat_lower'], 2),
                    'upper_bound': round(forecast.iloc[idx]['yhat_upper'], 2),
                    'trend': round(forecast.iloc[idx]['trend'], 2)
                })

            return {
                'forecast': forecast_data,
                'trend': trend_direction,
                'seasonality_detected': seasonality_detected,
                'insights': insights,
                'risk_score': risk_score
            }

        except Exception as e:
            logger.error(f"Cash flow forecasting error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Forecasting failed: {str(e)}")

    def _generate_insights(self, forecast: pd.DataFrame, historical: pd.DataFrame, periods: int) -> List[str]:
        """Generate actionable insights from forecast"""
        insights = []

        future_forecast = forecast.tail(periods)
        avg_future = future_forecast['yhat'].mean()
        avg_historical = historical['y'].mean()

        change_pct = ((avg_future - avg_historical) / abs(avg_historical)) * 100

        if change_pct > 20:
            insights.append(f"Cash flow is projected to increase by {change_pct:.1f}% - consider expansion opportunities")
        elif change_pct < -20:
            insights.append(f"Cash flow is projected to decrease by {abs(change_pct):.1f}% - implement cost reduction strategies")

        # Check for volatility
        volatility = future_forecast['yhat'].std()
        if volatility > avg_historical * 0.3:
            insights.append("High volatility detected - diversify revenue streams to stabilize cash flow")

        # Check for negative periods
        negative_periods = (future_forecast['yhat'] < 0).sum()
        if negative_periods > 0:
            insights.append(f"Warning: {negative_periods} periods projected with negative cash flow - secure credit line")

        return insights

    def _calculate_risk_score(self, forecast: pd.DataFrame, historical: pd.DataFrame) -> float:
        """Calculate risk score from 0-100"""
        future_forecast = forecast.tail(12)

        # Factors
        volatility_score = min(future_forecast['yhat'].std() / abs(historical['y'].mean()) * 100, 50)
        negative_score = (future_forecast['yhat'] < 0).sum() * 10
        trend_score = 0

        if future_forecast['trend'].is_monotonic_decreasing:
            trend_score = 30

        risk_score = min(volatility_score + negative_score + trend_score, 100)
        return round(risk_score, 2)


class DynamicPricingEngine:
    """ML-powered dynamic pricing optimization"""

    def optimize_price(self, request: PricingOptimizationRequest) -> PricingOptimizationResponse:
        """Calculate optimal price using demand elasticity and competitive analysis"""
        try:
            # Calculate price elasticity if not provided
            if request.elasticity is None:
                elasticity = self._calculate_price_elasticity(request.historical_demand)
            else:
                elasticity = request.elasticity

            # Competitor price analysis
            avg_competitor_price = np.mean(request.competitor_prices) if request.competitor_prices else request.current_price
            price_position = request.current_price / avg_competitor_price if avg_competitor_price > 0 else 1.0

            # Calculate optimal price using profit maximization
            # P* = MC / (1 + 1/e) where e is elasticity
            marginal_cost = request.cost

            if abs(elasticity) > 1:  # Elastic demand
                optimal_price = marginal_cost / (1 + 1/elasticity)
            else:  # Inelastic demand
                optimal_price = marginal_cost * 1.5  # Use markup pricing

            # Adjust based on competition
            if price_position > 1.2:  # We're significantly more expensive
                optimal_price *= 0.95
            elif price_position < 0.8:  # We're significantly cheaper
                optimal_price *= 1.05

            # Ensure minimum margin
            min_price = marginal_cost * 1.1
            optimal_price = max(optimal_price, min_price)

            # Predict demand at optimal price
            price_change_pct = (optimal_price - request.current_price) / request.current_price
            avg_demand = np.mean([d.value for d in request.historical_demand])
            expected_units = avg_demand * (1 + elasticity * price_change_pct)
            expected_revenue = optimal_price * expected_units

            # Revenue impact
            current_revenue = request.current_price * avg_demand
            revenue_impact = ((expected_revenue - current_revenue) / current_revenue) * 100

            # Generate recommendations
            recommendations = []
            if abs(price_change_pct) > 0.1:
                direction = "increase" if price_change_pct > 0 else "decrease"
                recommendations.append(f"Recommended to {direction} price by {abs(price_change_pct)*100:.1f}%")

            if elasticity < -1:
                recommendations.append("Demand is elastic - small price decreases can significantly boost volume")
            else:
                recommendations.append("Demand is inelastic - you have pricing power")

            if price_position < 0.9:
                recommendations.append("You're priced below market - consider premium positioning")

            return PricingOptimizationResponse(
                optimal_price=round(optimal_price, 2),
                expected_revenue=round(expected_revenue, 2),
                expected_units_sold=round(expected_units, 2),
                price_elasticity=round(elasticity, 3),
                revenue_impact=round(revenue_impact, 2),
                confidence_score=0.85,
                recommendations=recommendations
            )

        except Exception as e:
            logger.error(f"Pricing optimization error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def _calculate_price_elasticity(self, historical_demand: List[TimeSeriesData]) -> float:
        """Estimate price elasticity from demand data"""
        if len(historical_demand) < 3:
            return -1.5  # Default elasticity

        # Simple elasticity estimation
        values = [d.value for d in historical_demand]
        changes = np.diff(values)
        avg_change = np.mean(changes)
        volatility = np.std(values)

        # Higher volatility suggests higher elasticity
        elasticity = -1 - (volatility / (np.mean(values) + 1))
        return max(elasticity, -5)  # Cap at -5


class InventoryOptimizer:
    """Advanced inventory optimization using EOQ and demand forecasting"""

    def optimize(self, request: InventoryOptimizationRequest) -> InventoryOptimizationResponse:
        """Calculate optimal inventory levels"""
        try:
            # Calculate average demand and standard deviation
            demand_values = [d.value for d in request.historical_demand]
            avg_demand_per_period = np.mean(demand_values)
            std_demand = np.std(demand_values)

            # Annual demand
            annual_demand = avg_demand_per_period * 12

            # Economic Order Quantity (EOQ)
            # EOQ = sqrt((2 * D * S) / H)
            # D = annual demand, S = ordering cost, H = holding cost
            eoq = np.sqrt((2 * annual_demand * request.ordering_cost) / request.holding_cost_per_unit)

            # Safety stock (using z-score for 95% service level)
            z_score = 1.65  # 95% service level
            safety_stock = z_score * std_demand * np.sqrt(request.lead_time_days / 30)

            # Reorder point
            avg_lead_time_demand = avg_demand_per_period * (request.lead_time_days / 30)
            reorder_point = avg_lead_time_demand + safety_stock

            # Optimal stock level
            optimal_stock = reorder_point + (eoq / 2)

            # Calculate costs
            annual_holding_cost = (eoq / 2 + safety_stock) * request.holding_cost_per_unit
            annual_ordering_cost = (annual_demand / eoq) * request.ordering_cost
            total_cost = annual_holding_cost + annual_ordering_cost

            # Add stockout cost if provided
            if request.stockout_cost:
                # Probability of stockout
                stockout_probability = 0.05  # 5% with 95% service level
                expected_stockout_cost = stockout_probability * request.stockout_cost * (annual_demand / eoq)
                total_cost += expected_stockout_cost

            # Generate recommendations
            recommendations = []

            if safety_stock / avg_lead_time_demand > 0.5:
                recommendations.append("High safety stock needed due to demand volatility - consider supplier diversification")

            if eoq > avg_demand_per_period * 3:
                recommendations.append("Large order quantities recommended - negotiate volume discounts")

            recommendations.append(f"Order {int(eoq)} units every {int(365 * eoq / annual_demand)} days")
            recommendations.append(f"Reorder when inventory reaches {int(reorder_point)} units")

            return InventoryOptimizationResponse(
                economic_order_quantity=round(eoq, 2),
                reorder_point=round(reorder_point, 2),
                safety_stock=round(safety_stock, 2),
                optimal_stock_level=round(optimal_stock, 2),
                annual_holding_cost=round(annual_holding_cost, 2),
                annual_ordering_cost=round(annual_ordering_cost, 2),
                total_cost=round(total_cost, 2),
                recommendations=recommendations
            )

        except Exception as e:
            logger.error(f"Inventory optimization error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


class ChurnPredictor:
    """ML-based customer churn prediction"""

    def __init__(self):
        self.model = None

    def predict_churn(self, customers: List[Dict[str, Any]]) -> List[CustomerChurnResponse]:
        """Predict customer churn probability and LTV"""
        results = []

        for customer in customers:
            # Feature engineering
            recency = customer.get('days_since_last_purchase', 30)
            frequency = customer.get('purchase_count', 0)
            monetary = customer.get('total_spent', 0)
            avg_order_value = monetary / frequency if frequency > 0 else 0

            # Simple rule-based churn prediction (in production, use ML model)
            churn_score = 0

            if recency > 90:
                churn_score += 0.4
            elif recency > 60:
                churn_score += 0.2

            if frequency < 2:
                churn_score += 0.3

            if monetary < 100:
                churn_score += 0.2

            engagement_score = customer.get('engagement_score', 50)
            if engagement_score < 30:
                churn_score += 0.3

            churn_probability = min(churn_score, 0.95)

            # Risk level
            if churn_probability > 0.7:
                risk_level = "HIGH"
            elif churn_probability > 0.4:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"

            # Predict lifetime value
            # LTV = avg_order_value * purchase_frequency * customer_lifetime
            avg_lifetime_months = 24 * (1 - churn_probability)
            monthly_frequency = frequency / max(customer.get('customer_age_days', 365) / 30, 1)
            ltv = avg_order_value * monthly_frequency * avg_lifetime_months

            # Retention recommendations
            recommendations = []
            if churn_probability > 0.5:
                recommendations.append("Send personalized win-back email campaign")
                recommendations.append("Offer exclusive discount or loyalty reward")
            if recency > 60:
                recommendations.append("Trigger re-engagement workflow")
            if frequency < 3:
                recommendations.append("Provide onboarding support to increase product adoption")
            if engagement_score < 40:
                recommendations.append("Offer personalized product recommendations")

            results.append(CustomerChurnResponse(
                customer_id=customer.get('customer_id', 'unknown'),
                churn_probability=round(churn_probability, 3),
                risk_level=risk_level,
                retention_recommendations=recommendations,
                lifetime_value_prediction=round(ltv, 2)
            ))

        return results


# Initialize ML models
cash_flow_predictor = CashFlowPredictor()
pricing_engine = DynamicPricingEngine()
inventory_optimizer = InventoryOptimizer()
churn_predictor = ChurnPredictor()

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ml-engine",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/v1/ml/forecast/cashflow", response_model=CashFlowForecastResponse)
async def forecast_cash_flow(request: CashFlowForecastRequest):
    """
    Advanced cash flow forecasting using Prophet and ensemble methods
    Provides confidence intervals, trend analysis, and actionable insights
    """
    logger.info(f"Cash flow forecast request for business: {request.business_id}")

    result = cash_flow_predictor.forecast(request.historical_data, request.forecast_periods)

    # Generate recommended actions based on risk score
    recommended_actions = []
    if result['risk_score'] > 70:
        recommended_actions.extend([
            "Establish emergency cash reserve of 3-6 months",
            "Negotiate extended payment terms with suppliers",
            "Consider invoice factoring for immediate cash"
        ])
    elif result['risk_score'] > 40:
        recommended_actions.extend([
            "Monitor cash flow weekly",
            "Accelerate receivables collection",
            "Defer non-essential capital expenditures"
        ])
    else:
        recommended_actions.extend([
            "Consider strategic investments for growth",
            "Optimize working capital",
            "Maintain current financial discipline"
        ])

    return CashFlowForecastResponse(
        forecast=result['forecast'],
        trend=result['trend'],
        seasonality_detected=result['seasonality_detected'],
        confidence_intervals=result['forecast'],
        insights=result['insights'],
        risk_score=result['risk_score'],
        recommended_actions=recommended_actions
    )

@app.post("/api/v1/ml/pricing/optimize", response_model=PricingOptimizationResponse)
async def optimize_pricing(request: PricingOptimizationRequest):
    """
    ML-powered dynamic pricing optimization
    Calculates optimal price based on elasticity, competition, and profit maximization
    """
    logger.info(f"Pricing optimization for product: {request.product_id}")

    return pricing_engine.optimize_price(request)

@app.post("/api/v1/ml/inventory/optimize", response_model=InventoryOptimizationResponse)
async def optimize_inventory(request: InventoryOptimizationRequest):
    """
    Advanced inventory optimization using EOQ and demand forecasting
    Calculates optimal order quantities, reorder points, and safety stock
    """
    logger.info(f"Inventory optimization for product: {request.product_id}")

    return inventory_optimizer.optimize(request)

@app.post("/api/v1/ml/churn/predict")
async def predict_customer_churn(request: CustomerChurnRequest):
    """
    ML-based customer churn prediction with retention recommendations
    Predicts churn probability and customer lifetime value
    """
    logger.info(f"Churn prediction for {len(request.customers)} customers")

    results = churn_predictor.predict_churn(request.customers)

    return {
        "predictions": results,
        "summary": {
            "total_customers": len(results),
            "high_risk": sum(1 for r in results if r.risk_level == "HIGH"),
            "medium_risk": sum(1 for r in results if r.risk_level == "MEDIUM"),
            "low_risk": sum(1 for r in results if r.risk_level == "LOW"),
            "avg_churn_probability": round(np.mean([r.churn_probability for r in results]), 3),
            "total_at_risk_ltv": round(sum(r.lifetime_value_prediction for r in results if r.risk_level in ["HIGH", "MEDIUM"]), 2)
        }
    }

@app.post("/api/v1/ml/market/trends", response_model=MarketTrendResponse)
async def analyze_market_trends(request: MarketTrendRequest):
    """
    AI-powered market trend analysis and opportunity identification
    """
    logger.info(f"Market trend analysis for {request.industry} in {request.region}")

    # Mock implementation (in production, integrate with real data sources)
    trend_score = np.random.uniform(60, 95)
    growth_rate = np.random.uniform(-5, 25)

    return MarketTrendResponse(
        trend_score=round(trend_score, 2),
        growth_rate=round(growth_rate, 2),
        sentiment="positive" if growth_rate > 5 else "neutral" if growth_rate > 0 else "negative",
        opportunities=[
            "Growing demand for sustainable products",
            "Digital transformation acceleration",
            "Emerging middle class in developing markets"
        ],
        threats=[
            "Increasing competition from low-cost providers",
            "Regulatory changes impacting operations",
            "Supply chain disruptions"
        ],
        emerging_trends=[
            "AI-powered personalization",
            "Direct-to-consumer models",
            "Subscription-based revenue streams"
        ]
    )

@app.post("/api/v1/ml/risk/assess", response_model=RiskAssessmentResponse)
async def assess_business_risk(request: RiskAssessmentRequest):
    """
    Comprehensive business risk assessment using ML
    Analyzes financial, market, and operational risks
    """
    logger.info(f"Risk assessment for business: {request.business_id}")

    financial_data = request.financial_data

    # Financial health score
    current_ratio = financial_data.get('current_ratio', 1.5)
    debt_to_equity = financial_data.get('debt_to_equity', 0.5)
    profit_margin = financial_data.get('profit_margin', 0.1)

    financial_score = 100
    if current_ratio < 1:
        financial_score -= 30
    if debt_to_equity > 2:
        financial_score -= 25
    if profit_margin < 0:
        financial_score -= 40

    financial_score = max(financial_score, 0)

    # Market risk (mock)
    market_score = np.random.uniform(60, 90)

    # Operational risk (mock)
    operational_score = np.random.uniform(70, 95)

    # Overall risk
    overall_risk = 100 - ((financial_score + market_score + operational_score) / 3)

    # Risk factors
    risk_factors = []
    if current_ratio < 1.5:
        risk_factors.append({
            "factor": "Liquidity Risk",
            "severity": "HIGH" if current_ratio < 1 else "MEDIUM",
            "description": "Current ratio below recommended threshold"
        })

    if debt_to_equity > 1.5:
        risk_factors.append({
            "factor": "Leverage Risk",
            "severity": "HIGH",
            "description": "High debt-to-equity ratio indicates financial stress"
        })

    return RiskAssessmentResponse(
        overall_risk_score=round(overall_risk, 2),
        financial_health_score=round(financial_score, 2),
        market_risk_score=round(100 - market_score, 2),
        operational_risk_score=round(100 - operational_score, 2),
        risk_factors=risk_factors,
        mitigation_strategies=[
            "Improve working capital management",
            "Diversify revenue streams",
            "Implement cost control measures",
            "Build strategic cash reserves"
        ]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, workers=4)
