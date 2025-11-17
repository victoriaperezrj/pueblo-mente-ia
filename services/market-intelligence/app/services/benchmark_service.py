"""
Benchmark Automático Service
Competitive intelligence with web scraping + GPT-4 analysis
"""
import json
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import openai
from sqlalchemy.orm import Session
from bs4 import BeautifulSoup
import httpx
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout
from app.core.config import settings
from app.models.schemas import (
    BenchmarkRequest,
    BenchmarkResponse,
    CompetitorAnalysis
)
from app.models.database import BenchmarkAnalysis, AnalysisCache
import logging
import hashlib

logger = logging.getLogger(__name__)


class BenchmarkService:
    """Service for competitive benchmark analysis"""

    def __init__(self, db: Session):
        self.db = db
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

    async def analyze_competitors(self, request: BenchmarkRequest) -> BenchmarkResponse:
        """
        Perform comprehensive competitive analysis
        """
        try:
            logger.info(f"Starting benchmark analysis for industry: {request.industry}")

            # Step 1: Discover competitors
            competitors = await self._discover_competitors(request)
            logger.info(f"Found {len(competitors)} competitors to analyze")

            # Step 2: Scrape competitor data
            competitor_data = await self._scrape_competitor_data(competitors, request.analysis_depth)

            # Step 3: Analyze with GPT-4
            analysis = await self._analyze_with_gpt(request, competitor_data)

            # Step 4: Create response
            response = self._create_response(request, competitors, competitor_data, analysis)

            # Step 5: Save to database
            self._save_to_database(request, response)

            return response

        except Exception as e:
            logger.error(f"Benchmark analysis error: {str(e)}")
            raise

    async def _discover_competitors(self, request: BenchmarkRequest) -> List[str]:
        """
        Discover competitors using GPT-4 or user-provided list
        """
        if request.competitors and len(request.competitors) > 0:
            logger.info(f"Using user-provided competitors: {request.competitors}")
            return request.competitors

        if not request.auto_discover:
            return []

        try:
            # Use GPT-4 to discover top competitors
            prompt = f"""List the top 10 competitors in the {request.industry} industry in {request.country}.

For each competitor, provide:
1. Company name
2. Website URL (if public company)
3. Brief description (1 sentence)

Respond with valid JSON:
{{
  "competitors": [
    {{
      "name": "Company Name",
      "website": "https://example.com",
      "description": "Brief description"
    }}
  ]
}}"""

            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a business intelligence expert. Provide accurate, up-to-date information about companies and competitors."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )

            data = json.loads(response.choices[0].message.content)
            competitors = [c.get("website") or c.get("name") for c in data.get("competitors", [])]

            logger.info(f"GPT-4 discovered {len(competitors)} competitors")
            return competitors[:10]  # Limit to 10

        except Exception as e:
            logger.error(f"Competitor discovery error: {str(e)}")
            return []

    async def _scrape_competitor_data(
        self,
        competitors: List[str],
        depth: str = "standard"
    ) -> List[Dict[str, Any]]:
        """
        Scrape competitor websites for data
        """
        if not settings.ENABLE_WEB_SCRAPING:
            logger.info("Web scraping disabled, skipping")
            return []

        scraped_data = []

        # Limit concurrent scraping
        semaphore = asyncio.Semaphore(settings.MAX_CONCURRENT_SCRAPES)

        async def scrape_one(competitor: str) -> Optional[Dict[str, Any]]:
            async with semaphore:
                try:
                    if competitor.startswith("http"):
                        return await self._scrape_website(competitor, depth)
                    else:
                        # Just a name, search for basic info
                        return {"name": competitor, "scraped": False}
                except Exception as e:
                    logger.error(f"Error scraping {competitor}: {str(e)}")
                    return {"name": competitor, "error": str(e)}

        # Scrape all competitors in parallel
        tasks = [scrape_one(comp) for comp in competitors]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for result in results:
            if isinstance(result, dict):
                scraped_data.append(result)

        logger.info(f"Successfully scraped {len(scraped_data)} competitors")
        return scraped_data

    async def _scrape_website(self, url: str, depth: str) -> Dict[str, Any]:
        """
        Scrape a single website using Playwright
        """
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=settings.PLAYWRIGHT_HEADLESS)
                page = await browser.new_page()

                # Navigate to URL
                await page.goto(url, timeout=settings.SCRAPING_TIMEOUT, wait_until="domcontentloaded")

                # Get page content
                content = await page.content()

                # Parse with BeautifulSoup
                soup = BeautifulSoup(content, 'lxml')

                # Extract key information
                data = {
                    "url": url,
                    "title": soup.title.string if soup.title else "",
                    "description": self._extract_meta_description(soup),
                    "headings": [h.text.strip() for h in soup.find_all(['h1', 'h2'])[:10]],
                    "text_content": self._extract_text_content(soup)[:2000],  # Limit to 2000 chars
                    "links": [a.get('href') for a in soup.find_all('a', href=True)[:20]],
                    "scraped": True,
                    "scraped_at": datetime.utcnow().isoformat()
                }

                await browser.close()

                logger.info(f"Successfully scraped: {url}")
                return data

        except PlaywrightTimeout:
            logger.warning(f"Timeout scraping: {url}")
            return {"url": url, "error": "timeout", "scraped": False}
        except Exception as e:
            logger.error(f"Error scraping {url}: {str(e)}")
            return {"url": url, "error": str(e), "scraped": False}

    def _extract_meta_description(self, soup: BeautifulSoup) -> str:
        """Extract meta description from HTML"""
        meta_desc = soup.find("meta", attrs={"name": "description"})
        if meta_desc and meta_desc.get("content"):
            return meta_desc.get("content")

        og_desc = soup.find("meta", property="og:description")
        if og_desc and og_desc.get("content"):
            return og_desc.get("content")

        return ""

    def _extract_text_content(self, soup: BeautifulSoup) -> str:
        """Extract main text content"""
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()

        # Get text
        text = soup.get_text()

        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)

        return text

    async def _analyze_with_gpt(
        self,
        request: BenchmarkRequest,
        competitor_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyze competitor data with GPT-4
        """
        try:
            # Prepare competitor summary
            competitor_summary = json.dumps(competitor_data, indent=2)[:8000]  # Limit size

            prompt = f"""Analyze these competitors in the {request.industry} industry ({request.country}):

**Competitor Data:**
{competitor_summary}

Provide a comprehensive competitive analysis with:

1. **Individual Competitor Analysis**: For each major competitor:
   - Strengths (3-5 points)
   - Weaknesses (3-5 points)
   - Key features/offerings
   - Pricing model (if available)
   - Estimated market share
   - Customer sentiment

2. **Market Gap Opportunities**: 5-8 opportunities not well-served by competitors

3. **Differentiation Strategies**: 5-7 ways to stand out

4. **Pricing Recommendations**: Suggested pricing strategies with ranges

5. **Industry Trends**: 5-7 current trends in this industry

6. **Best Practices**: 5-7 best practices to adopt

7. **Warnings**: 3-5 pitfalls to avoid

Respond with valid JSON:
{{
  "competitors": [
    {{
      "name": "Company Name",
      "website": "URL or null",
      "strengths": ["strength 1", ...],
      "weaknesses": ["weakness 1", ...],
      "key_features": ["feature 1", ...],
      "pricing_model": "description or null",
      "estimated_market_share": "% or description",
      "customer_sentiment": "Positive|Neutral|Negative"
    }}
  ],
  "market_gap_opportunities": ["opportunity 1", ...],
  "differentiation_strategies": ["strategy 1", ...],
  "pricing_recommendations": {{
    "strategy": "description",
    "min_price": <float or null>,
    "recommended_price": <float or null>,
    "premium_price": <float or null>
  }},
  "industry_trends": ["trend 1", ...],
  "best_practices": ["practice 1", ...],
  "warnings": ["warning 1", ...],
  "confidence_level": <float 0-1>
}}"""

            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a competitive intelligence analyst with expertise in market research and strategic analysis."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.5,
                max_tokens=4000,
                response_format={"type": "json_object"}
            )

            analysis = json.loads(response.choices[0].message.content)
            logger.info("GPT-4 competitive analysis completed")

            return analysis

        except Exception as e:
            logger.error(f"GPT-4 analysis error: {str(e)}")
            raise

    def _create_response(
        self,
        request: BenchmarkRequest,
        competitors: List[str],
        competitor_data: List[Dict[str, Any]],
        analysis: Dict[str, Any]
    ) -> BenchmarkResponse:
        """Create response object"""

        # Parse competitor analyses
        competitor_analyses = []
        for comp in analysis.get("competitors", []):
            try:
                competitor_analyses.append(CompetitorAnalysis(**comp))
            except Exception as e:
                logger.error(f"Error parsing competitor analysis: {str(e)}")

        return BenchmarkResponse(
            benchmark_id=str(self.db.query(BenchmarkAnalysis)
                           .filter(BenchmarkAnalysis.user_id == request.user_id)
                           .count() + 1),
            industry=request.industry,
            analysis_date=datetime.utcnow(),
            competitors_analyzed=competitor_analyses,
            total_competitors_found=len(competitors),
            market_gap_opportunities=analysis.get("market_gap_opportunities", []),
            differentiation_strategies=analysis.get("differentiation_strategies", []),
            pricing_recommendations=analysis.get("pricing_recommendations", {}),
            industry_trends=analysis.get("industry_trends", []),
            best_practices=analysis.get("best_practices", []),
            warnings=analysis.get("warnings", []),
            data_sources=["GPT-4", "Web Scraping"] if competitor_data else ["GPT-4"],
            confidence_level=float(analysis.get("confidence_level", 0.7))
        )

    def _save_to_database(self, request: BenchmarkRequest, response: BenchmarkResponse):
        """Save analysis to database"""
        try:
            benchmark = BenchmarkAnalysis(
                user_id=request.user_id,
                business_id=request.business_id,
                industry=request.industry,
                requested_competitors=request.competitors,
                auto_discover=request.auto_discover,
                country=request.country,
                analysis_depth=request.analysis_depth,
                competitors_analyzed=[comp.model_dump() for comp in response.competitors_analyzed],
                total_competitors_found=response.total_competitors_found,
                market_gap_opportunities=response.market_gap_opportunities,
                differentiation_strategies=response.differentiation_strategies,
                pricing_recommendations=response.pricing_recommendations,
                industry_trends=response.industry_trends,
                best_practices=response.best_practices,
                warnings=response.warnings,
                data_sources=response.data_sources,
                confidence_level=response.confidence_level
            )

            self.db.add(benchmark)
            self.db.commit()
            logger.info(f"Benchmark analysis saved for user: {request.user_id}")

        except Exception as e:
            logger.error(f"Database save error: {str(e)}")
            self.db.rollback()
            raise
