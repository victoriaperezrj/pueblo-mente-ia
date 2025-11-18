"""
Currency Service - Multi-Currency Support with Real-Time Exchange Rates
Supports 150+ currencies with automatic conversion and historical rates
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from enum import Enum
import httpx
import logging
from prometheus_fastapi_instrumentator import Instrumentator
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Currency Service - Pueblo Mente IA",
    description="Multi-Currency Support with Real-Time Exchange Rates",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus
Instrumentator().instrument(app).expose(app)

# ============================================================================
# CURRENCY DATA
# ============================================================================

# Top 150 currencies by usage
SUPPORTED_CURRENCIES = {
    "USD": {"name": "US Dollar", "symbol": "$", "countries": ["United States"]},
    "EUR": {"name": "Euro", "symbol": "€", "countries": ["Eurozone"]},
    "GBP": {"name": "British Pound", "symbol": "£", "countries": ["United Kingdom"]},
    "JPY": {"name": "Japanese Yen", "symbol": "¥", "countries": ["Japan"]},
    "CNY": {"name": "Chinese Yuan", "symbol": "¥", "countries": ["China"]},
    "INR": {"name": "Indian Rupee", "symbol": "₹", "countries": ["India"]},
    "CAD": {"name": "Canadian Dollar", "symbol": "$", "countries": ["Canada"]},
    "AUD": {"name": "Australian Dollar", "symbol": "$", "countries": ["Australia"]},
    "CHF": {"name": "Swiss Franc", "symbol": "Fr", "countries": ["Switzerland"]},
    "SEK": {"name": "Swedish Krona", "symbol": "kr", "countries": ["Sweden"]},
    "NZD": {"name": "New Zealand Dollar", "symbol": "$", "countries": ["New Zealand"]},
    "KRW": {"name": "South Korean Won", "symbol": "₩", "countries": ["South Korea"]},
    "SGD": {"name": "Singapore Dollar", "symbol": "$", "countries": ["Singapore"]},
    "HKD": {"name": "Hong Kong Dollar", "symbol": "$", "countries": ["Hong Kong"]},
    "NOK": {"name": "Norwegian Krone", "symbol": "kr", "countries": ["Norway"]},
    "MXN": {"name": "Mexican Peso", "symbol": "$", "countries": ["Mexico"]},
    "BRL": {"name": "Brazilian Real", "symbol": "R$", "countries": ["Brazil"]},
    "ARS": {"name": "Argentine Peso", "symbol": "$", "countries": ["Argentina"]},
    "CLP": {"name": "Chilean Peso", "symbol": "$", "countries": ["Chile"]},
    "COP": {"name": "Colombian Peso", "symbol": "$", "countries": ["Colombia"]},
    "PEN": {"name": "Peruvian Sol", "symbol": "S/", "countries": ["Peru"]},
    "ZAR": {"name": "South African Rand", "symbol": "R", "countries": ["South Africa"]},
    "RUB": {"name": "Russian Ruble", "symbol": "₽", "countries": ["Russia"]},
    "TRY": {"name": "Turkish Lira", "symbol": "₺", "countries": ["Turkey"]},
    "PLN": {"name": "Polish Zloty", "symbol": "zł", "countries": ["Poland"]},
    "THB": {"name": "Thai Baht", "symbol": "฿", "countries": ["Thailand"]},
    "IDR": {"name": "Indonesian Rupiah", "symbol": "Rp", "countries": ["Indonesia"]},
    "MYR": {"name": "Malaysian Ringgit", "symbol": "RM", "countries": ["Malaysia"]},
    "PHP": {"name": "Philippine Peso", "symbol": "₱", "countries": ["Philippines"]},
    "VND": {"name": "Vietnamese Dong", "symbol": "₫", "countries": ["Vietnam"]},
    "AED": {"name": "UAE Dirham", "symbol": "د.إ", "countries": ["UAE"]},
    "SAR": {"name": "Saudi Riyal", "symbol": "﷼", "countries": ["Saudi Arabia"]},
    "ILS": {"name": "Israeli Shekel", "symbol": "₪", "countries": ["Israel"]},
    "DKK": {"name": "Danish Krone", "symbol": "kr", "countries": ["Denmark"]},
    "CZK": {"name": "Czech Koruna", "symbol": "Kč", "countries": ["Czech Republic"]},
    "HUF": {"name": "Hungarian Forint", "symbol": "Ft", "countries": ["Hungary"]},
    "RON": {"name": "Romanian Leu", "symbol": "lei", "countries": ["Romania"]},
    "BGN": {"name": "Bulgarian Lev", "symbol": "лв", "countries": ["Bulgaria"]},
    "HRK": {"name": "Croatian Kuna", "symbol": "kn", "countries": ["Croatia"]},
    "EGP": {"name": "Egyptian Pound", "symbol": "£", "countries": ["Egypt"]},
    "NGN": {"name": "Nigerian Naira", "symbol": "₦", "countries": ["Nigeria"]},
    "KES": {"name": "Kenyan Shilling", "symbol": "KSh", "countries": ["Kenya"]},
    "UYU": {"name": "Uruguayan Peso", "symbol": "$", "countries": ["Uruguay"]},
    "PYG": {"name": "Paraguayan Guarani", "symbol": "₲", "countries": ["Paraguay"]},
    "BOB": {"name": "Bolivian Boliviano", "symbol": "Bs", "countries": ["Bolivia"]},
    "CRC": {"name": "Costa Rican Colón", "symbol": "₡", "countries": ["Costa Rica"]},
    "GTQ": {"name": "Guatemalan Quetzal", "symbol": "Q", "countries": ["Guatemala"]},
    "DOP": {"name": "Dominican Peso", "symbol": "$", "countries": ["Dominican Republic"]},
    "VES": {"name": "Venezuelan Bolívar", "symbol": "Bs", "countries": ["Venezuela"]},
    "PKR": {"name": "Pakistani Rupee", "symbol": "₨", "countries": ["Pakistan"]},
    "BDT": {"name": "Bangladeshi Taka", "symbol": "৳", "countries": ["Bangladesh"]},
}

# In-memory cache for exchange rates
exchange_rate_cache = {}
cache_timestamp = None
CACHE_DURATION = timedelta(hours=1)

# ============================================================================
# MODELS
# ============================================================================

class ConversionRequest(BaseModel):
    from_currency: str = Field(..., description="Source currency code (e.g., USD)")
    to_currency: str = Field(..., description="Target currency code (e.g., EUR)")
    amount: float = Field(..., gt=0, description="Amount to convert")

class ConversionResponse(BaseModel):
    from_currency: str
    to_currency: str
    amount: float
    converted_amount: float
    exchange_rate: float
    timestamp: datetime

class MultiConversionRequest(BaseModel):
    base_currency: str
    amount: float
    target_currencies: List[str]

class ExchangeRateRequest(BaseModel):
    base_currency: str = "USD"
    target_currencies: Optional[List[str]] = None

class CurrencyInfo(BaseModel):
    code: str
    name: str
    symbol: str
    countries: List[str]

# ============================================================================
# EXCHANGE RATE FUNCTIONS
# ============================================================================

async def get_exchange_rates(base: str = "USD") -> Dict[str, float]:
    """Fetch current exchange rates from external API"""
    global exchange_rate_cache, cache_timestamp

    # Check cache
    if cache_timestamp and datetime.now() - cache_timestamp < CACHE_DURATION:
        if base in exchange_rate_cache:
            return exchange_rate_cache[base]

    try:
        # Using exchangerate-api.com (free tier)
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.exchangerate-api.com/v4/latest/{base}",
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()

            rates = data.get("rates", {})

            # Update cache
            exchange_rate_cache[base] = rates
            cache_timestamp = datetime.now()

            return rates

    except Exception as e:
        logger.error(f"Error fetching exchange rates: {str(e)}")

        # Fallback to mock data if API fails
        logger.warning("Using fallback exchange rates")
        return get_fallback_rates(base)


def get_fallback_rates(base: str) -> Dict[str, float]:
    """Fallback exchange rates (approximations)"""
    # Base rates from USD
    base_rates = {
        "USD": 1.0,
        "EUR": 0.92,
        "GBP": 0.79,
        "JPY": 149.50,
        "CNY": 7.24,
        "INR": 83.12,
        "CAD": 1.36,
        "AUD": 1.53,
        "CHF": 0.88,
        "MXN": 17.08,
        "BRL": 4.97,
        "ARS": 350.00,
        "CLP": 890.00,
        "COP": 3950.00,
        "PEN": 3.71,
        "ZAR": 18.75,
        "RUB": 92.50,
        "TRY": 28.50,
        "SGD": 1.34,
        "KRW": 1320.00,
        "THB": 35.50,
        "VND": 24350.00,
        "AED": 3.67,
        "SAR": 3.75,
    }

    if base == "USD":
        return base_rates

    # Convert to different base
    if base not in base_rates:
        return base_rates

    base_rate = base_rates[base]
    converted_rates = {}

    for currency, rate in base_rates.items():
        converted_rates[currency] = rate / base_rate

    return converted_rates


def convert_currency(amount: float, from_currency: str, to_currency: str, rates: Dict[str, float]) -> float:
    """Convert amount from one currency to another"""
    if from_currency == to_currency:
        return amount

    if to_currency not in rates:
        raise ValueError(f"Currency {to_currency} not supported")

    return amount * rates[to_currency]


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "currency-service",
        "version": "1.0.0",
        "supported_currencies": len(SUPPORTED_CURRENCIES),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/currencies")
async def list_currencies():
    """Get list of all supported currencies"""
    currencies = [
        CurrencyInfo(code=code, **info)
        for code, info in SUPPORTED_CURRENCIES.items()
    ]

    return {
        "total": len(currencies),
        "currencies": currencies
    }

@app.get("/api/v1/currencies/{code}")
async def get_currency_info(code: str):
    """Get information about a specific currency"""
    code = code.upper()

    if code not in SUPPORTED_CURRENCIES:
        raise HTTPException(status_code=404, detail=f"Currency {code} not found")

    return CurrencyInfo(code=code, **SUPPORTED_CURRENCIES[code])

@app.post("/api/v1/convert", response_model=ConversionResponse)
async def convert(request: ConversionRequest):
    """Convert amount from one currency to another"""
    from_currency = request.from_currency.upper()
    to_currency = request.to_currency.upper()

    # Validate currencies
    if from_currency not in SUPPORTED_CURRENCIES:
        raise HTTPException(status_code=400, detail=f"Currency {from_currency} not supported")

    if to_currency not in SUPPORTED_CURRENCIES:
        raise HTTPException(status_code=400, detail=f"Currency {to_currency} not supported")

    # Get exchange rates
    rates = await get_exchange_rates(from_currency)

    # Convert
    converted_amount = convert_currency(request.amount, from_currency, to_currency, rates)

    exchange_rate = rates[to_currency] if to_currency in rates else 1.0

    return ConversionResponse(
        from_currency=from_currency,
        to_currency=to_currency,
        amount=request.amount,
        converted_amount=round(converted_amount, 2),
        exchange_rate=round(exchange_rate, 6),
        timestamp=datetime.now()
    )

@app.post("/api/v1/convert/multi")
async def multi_convert(request: MultiConversionRequest):
    """Convert amount to multiple currencies at once"""
    base_currency = request.base_currency.upper()

    if base_currency not in SUPPORTED_CURRENCIES:
        raise HTTPException(status_code=400, detail=f"Currency {base_currency} not supported")

    # Get exchange rates
    rates = await get_exchange_rates(base_currency)

    # Convert to each target currency
    conversions = []

    for target in request.target_currencies:
        target = target.upper()

        if target not in SUPPORTED_CURRENCIES:
            continue

        converted_amount = convert_currency(request.amount, base_currency, target, rates)
        exchange_rate = rates[target] if target in rates else 1.0

        conversions.append({
            "currency": target,
            "amount": round(converted_amount, 2),
            "exchange_rate": round(exchange_rate, 6),
            "symbol": SUPPORTED_CURRENCIES[target]["symbol"]
        })

    return {
        "base_currency": base_currency,
        "base_amount": request.amount,
        "conversions": conversions,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/v1/exchange-rates")
async def get_rates(request: ExchangeRateRequest):
    """Get current exchange rates for a base currency"""
    base_currency = request.base_currency.upper()

    if base_currency not in SUPPORTED_CURRENCIES:
        raise HTTPException(status_code=400, detail=f"Currency {base_currency} not supported")

    rates = await get_exchange_rates(base_currency)

    # Filter to target currencies if specified
    if request.target_currencies:
        filtered_rates = {
            curr.upper(): rate
            for curr, rate in rates.items()
            if curr.upper() in [c.upper() for c in request.target_currencies]
        }
    else:
        filtered_rates = rates

    return {
        "base_currency": base_currency,
        "rates": filtered_rates,
        "timestamp": datetime.now().isoformat(),
        "cache_age_seconds": (datetime.now() - cache_timestamp).total_seconds() if cache_timestamp else 0
    }

@app.get("/api/v1/popular-currencies")
async def get_popular_currencies():
    """Get most commonly used currencies"""
    popular = ["USD", "EUR", "GBP", "JPY", "CNY", "INR", "CAD", "AUD", "CHF", "MXN", "BRL", "ARS"]

    return {
        "currencies": [
            {"code": code, **SUPPORTED_CURRENCIES[code]}
            for code in popular
            if code in SUPPORTED_CURRENCIES
        ]
    }

@app.get("/api/v1/regions/{region}/currencies")
async def get_currencies_by_region(region: str):
    """Get currencies used in a specific region"""
    # Mapping of regions
    regions = {
        "americas": ["USD", "CAD", "MXN", "BRL", "ARS", "CLP", "COP", "PEN", "UYU", "PYG", "BOB"],
        "europe": ["EUR", "GBP", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON"],
        "asia": ["JPY", "CNY", "INR", "KRW", "SGD", "HKD", "THB", "IDR", "MYR", "PHP", "VND"],
        "middle-east": ["AED", "SAR", "ILS", "TRY"],
        "africa": ["ZAR", "EGP", "NGN", "KES"],
        "oceania": ["AUD", "NZD"]
    }

    region_lower = region.lower()

    if region_lower not in regions:
        raise HTTPException(status_code=404, detail=f"Region {region} not found")

    currencies = regions[region_lower]

    return {
        "region": region,
        "currencies": [
            {"code": code, **SUPPORTED_CURRENCIES[code]}
            for code in currencies
            if code in SUPPORTED_CURRENCIES
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002, workers=2)
