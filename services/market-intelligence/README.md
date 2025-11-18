# Market Intelligence Service

AI-powered market analysis and validation platform for entrepreneurs and businesses.

## 🚀 Features

### 1. Market Test Express
**AI-powered market viability analysis in seconds**

- **Viability Scoring**: 0-100 score based on comprehensive AI analysis
- **SWOT Analysis**: Automated strengths, weaknesses, opportunities, and threats
- **Market Sizing**: Estimation with TAM/SAM/SOM breakdown
- **Competition Analysis**: Competition level and key competitors identification
- **Risk Assessment**: Overall risk evaluation with mitigation strategies
- **Financial Projections**: Startup costs, revenue potential, and time to market
- **AI Recommendations**: GPT-4 powered actionable recommendations
- **Next Steps**: Clear roadmap for moving forward

### 2. Benchmark Automático
**Competitive intelligence with web scraping + GPT-4**

- **Auto-Discovery**: AI finds your top competitors automatically
- **Web Scraping**: Extract competitor data from websites using Playwright
- **Competitor Analysis**: Deep dive into each competitor's strengths/weaknesses
- **Market Gaps**: Identify opportunities not served by competitors
- **Differentiation Strategies**: AI-generated strategies to stand out
- **Pricing Intelligence**: Competitive pricing analysis and recommendations
- **Industry Trends**: Stay updated with current market trends
- **Best Practices**: Learn from industry leaders

### 3. Generador de Público Objetivo
**Target audience analysis with DALL-E 3 persona avatars**

- **AI Persona Generation**: Create detailed customer personas
- **Visual Avatars**: DALL-E 3 generated photorealistic persona images
- **Demographics**: Age, occupation, income, location
- **Psychographics**: Interests, values, pain points, goals
- **Behavioral Insights**: Buying behavior and decision factors
- **Channel Recommendations**: Best marketing channels for each segment
- **Messaging Strategy**: AI-optimized messaging for your audience
- **Engagement Tactics**: Specific tactics to engage your personas

## 🛠️ Technology Stack

- **Framework**: FastAPI (Python 3.11+)
- **AI/ML**:
  - OpenAI GPT-4 Turbo (market analysis, competitive intelligence)
  - DALL-E 3 (persona avatar generation)
- **Web Scraping**: Playwright + BeautifulSoup4
- **Database**: PostgreSQL with JSONB support
- **Caching**: Redis
- **Validation**: Pydantic V2
- **Testing**: pytest + pytest-asyncio

## 📦 Installation

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- OpenAI API key

### Local Development

```bash
# Navigate to service directory
cd services/market-intelligence

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key

# Run database migrations
psql -U admin -d pueblomente -f migrations/001_create_tables.sql

# Start the service
uvicorn app.main:app --reload --host 0.0.0.0 --port 8004
```

### Docker

```bash
# Build image
docker build -t market-intelligence:latest .

# Run container
docker run -d \
  -p 8004:8004 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e OPENAI_API_KEY=your-key-here \
  --name market-intelligence \
  market-intelligence:latest
```

### Docker Compose

```bash
# From project root
docker-compose -f docker-compose.enterprise.yml up market-intelligence
```

## 🔧 Configuration

Environment variables (`.env`):

```env
# API Configuration
APP_NAME=Market Intelligence Service
DEBUG=False

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pueblomente

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.7

# Web Scraping
PLAYWRIGHT_HEADLESS=True
SCRAPING_TIMEOUT=30000
MAX_CONCURRENT_SCRAPES=5

# Feature Flags
ENABLE_WEB_SCRAPING=True
ENABLE_DALLE_GENERATION=True
ENABLE_CACHING=True
CACHE_TTL=3600
```

## 📡 API Documentation

Once running, access interactive API docs at:

- **Swagger UI**: http://localhost:8004/docs
- **ReDoc**: http://localhost:8004/redoc

### Main Endpoints

#### Market Test Express
```
POST /api/v1/validation/market-test
```

**Request:**
```json
{
  "user_id": "user-123",
  "idea_description": "AI-powered meal planning app...",
  "target_market": "Urban professionals aged 25-45",
  "initial_investment": 50000,
  "currency": "USD",
  "country": "US",
  "industry": "Food Tech"
}
```

**Response:** Comprehensive viability analysis with SWOT, recommendations, financial projections.

#### Benchmark Automático
```
POST /api/v1/validation/benchmark
```

**Request:**
```json
{
  "user_id": "user-123",
  "industry": "E-commerce Fashion",
  "auto_discover": true,
  "country": "US",
  "analysis_depth": "standard"
}
```

**Response:** Competitor analysis, market gaps, differentiation strategies.

#### Target Audience Generator
```
POST /api/v1/validation/target-audience
```

**Request:**
```json
{
  "user_id": "user-123",
  "business_description": "Sustainable fashion brand...",
  "product_service": "Eco-friendly clothing...",
  "generate_personas": true,
  "num_personas": 3,
  "country": "US"
}
```

**Response:** Detailed personas with DALL-E avatars, marketing strategies.

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_market_test_service.py -v

# Run with output
pytest -s
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure production database with SSL
- [ ] Set up Redis with authentication
- [ ] Add OpenAI API key
- [ ] Configure rate limiting
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Enable HTTPS
- [ ] Set up backup strategy
- [ ] Configure log aggregation

### Performance Optimization

- **Caching**: Redis caching for expensive GPT-4 calls (1-hour TTL)
- **Rate Limiting**: 100 requests/hour per user
- **Async Operations**: All I/O operations are async
- **Connection Pooling**: PostgreSQL connection pool (10 connections)
- **Scraping Limits**: Max 5 concurrent scraping operations

## 📊 Database Schema

### Tables

- **market_tests**: Market viability analysis results
- **benchmark_analyses**: Competitive benchmark results
- **target_audiences**: Audience analysis and personas
- **analysis_cache**: Redis-backed cache for results

See `migrations/001_create_tables.sql` for complete schema.

## 🔐 Security

- Input validation with Pydantic
- SQL injection prevention via SQLAlchemy ORM
- CORS configuration
- Rate limiting
- API key authentication (JWT ready)
- Secure headers

## 📈 Monitoring

Prometheus metrics available at `/metrics`:

- Request count and latency
- OpenAI API calls and costs
- Cache hit/miss ratio
- Database query performance
- Active connections

## 🤝 Integration

### Frontend Integration

React components available in `/src/pages/validation/`:

- `MarketTestExpress.tsx`
- `BenchmarkAutomatico.tsx`
- `TargetAudienceGenerator.tsx`

### API Gateway

Service is designed to work behind an API gateway:

```
Client → API Gateway (8080) → Market Intelligence (8004)
```

## 💰 Cost Optimization

### OpenAI API Costs

Approximate costs per request:

- **Market Test**: $0.10 - $0.20 (GPT-4 Turbo)
- **Benchmark**: $0.15 - $0.30 (GPT-4 + optional scraping)
- **Target Audience**: $0.20 - $0.80 (GPT-4 + DALL-E 3 images)

**Cost Reduction Strategies:**

1. **Caching**: Reuse results for similar queries (1-hour TTL)
2. **Rate Limiting**: Prevent abuse
3. **Batch Processing**: Group related analyses
4. **Graceful Degradation**: Fallback when DALL-E disabled

## 📝 License

Copyright © 2024 Pueblo Mente IA

## 🙏 Credits

Built with:
- FastAPI
- OpenAI GPT-4 & DALL-E 3
- Playwright
- PostgreSQL
- Redis
