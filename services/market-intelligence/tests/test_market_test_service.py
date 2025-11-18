"""
Tests for Market Test Service
"""
import pytest
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime
from app.services.market_test_service import MarketTestService
from app.models.schemas import MarketTestRequest, MarketSize


@pytest.fixture
def mock_db():
    """Mock database session"""
    return Mock()


@pytest.fixture
def market_test_service(mock_db):
    """Create MarketTestService instance with mocked dependencies"""
    return MarketTestService(mock_db)


@pytest.fixture
def sample_request():
    """Sample market test request"""
    return MarketTestRequest(
        user_id="test-user-123",
        business_id="test-business-456",
        idea_description="AI-powered meal planning app for busy professionals",
        target_market="Urban professionals aged 25-45 with disposable income",
        initial_investment=50000.0,
        currency="USD",
        country="US",
        industry="Food Tech"
    )


@pytest.fixture
def sample_gpt_response():
    """Sample GPT-4 response"""
    return {
        "viability_score": 78.5,
        "market_size": "medium",
        "market_size_description": "Growing market with millions of potential customers",
        "competition_level": "High",
        "risk_level": "Medium",
        "strengths": [
            "Solves real pain point for busy professionals",
            "Large and growing target market",
            "Recurring revenue potential through subscriptions",
            "Opportunities for partnerships with health brands"
        ],
        "weaknesses": [
            "Highly competitive market with established players",
            "Requires significant marketing budget to stand out",
            "User retention can be challenging",
            "Dependent on content quality and variety"
        ],
        "opportunities": [
            "Partner with corporate wellness programs",
            "Integrate with meal kit delivery services",
            "Expand to nutritionist consultation services",
            "Build community features for engagement"
        ],
        "threats": [
            "Established competitors like Mealime and Yummly",
            "Changing dietary trends and preferences",
            "Economic downturn affecting discretionary spending",
            "Data privacy concerns with health information"
        ],
        "recommendations": [
            "Start with MVP focusing on one cuisine type",
            "Build strong content library before launch",
            "Focus on one niche (e.g., keto, vegan) initially",
            "Leverage social proof and influencer partnerships",
            "Implement freemium model to drive adoption"
        ],
        "next_steps": [
            "Validate concept with 100 beta users",
            "Develop core app with basic meal planning features",
            "Secure seed funding ($200K-$500K)",
            "Build partnerships with 2-3 nutritionists",
            "Create content for 100+ recipes",
            "Launch targeted marketing campaign",
            "Iterate based on user feedback"
        ],
        "estimated_market_size_usd": 5000000000.0,
        "estimated_startup_cost": {
            "minimum": 25000,
            "realistic": 75000,
            "optimal": 150000,
            "breakdown": {
                "app_development": 40000,
                "content_creation": 15000,
                "marketing": 10000,
                "legal_compliance": 5000,
                "operations": 5000
            }
        },
        "revenue_potential": "Potential to reach $500K ARR within 18 months with 5,000 paying subscribers at $8.33/month",
        "time_to_market": "4-6 months for MVP",
        "confidence_level": 0.85
    }


class TestMarketTestService:
    """Test cases for MarketTestService"""

    @pytest.mark.asyncio
    async def test_analyze_market_success(
        self,
        market_test_service,
        sample_request,
        sample_gpt_response,
        mock_db
    ):
        """Test successful market analysis"""
        # Mock OpenAI client
        with patch.object(market_test_service, 'client') as mock_client:
            # Mock GPT-4 response
            mock_response = Mock()
            mock_response.choices = [Mock()]
            mock_response.choices[0].message.content = str(sample_gpt_response).replace("'", '"')
            mock_response.model = "gpt-4-turbo-preview"

            mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

            # Execute
            result = await market_test_service.analyze_market(sample_request)

            # Assertions
            assert result is not None
            assert result.viability_score == 78.5
            assert result.market_size == MarketSize.MEDIUM
            assert result.competition_level == "High"
            assert result.risk_level == "Medium"
            assert len(result.strengths) == 4
            assert len(result.weaknesses) == 4
            assert len(result.opportunities) == 4
            assert len(result.threats) == 4
            assert len(result.recommendations) >= 5
            assert len(result.next_steps) >= 5
            assert result.gpt_model_used == "gpt-4-turbo-preview"
            assert result.confidence_level == 0.85

    def test_get_system_prompt(self, market_test_service):
        """Test system prompt generation"""
        prompt = market_test_service._get_system_prompt()

        assert "expert business consultant" in prompt.lower()
        assert "market analyst" in prompt.lower()
        assert "json" in prompt.lower()
        assert "viability_score" in prompt

    def test_build_analysis_prompt(self, market_test_service, sample_request):
        """Test analysis prompt building"""
        prompt = market_test_service._build_analysis_prompt(sample_request)

        assert sample_request.idea_description in prompt
        assert sample_request.target_market in prompt
        assert sample_request.country in prompt
        assert "SWOT" in prompt
        assert "recommendations" in prompt
        assert "viability" in prompt.lower()

    def test_create_response(
        self,
        market_test_service,
        sample_request,
        sample_gpt_response,
        mock_db
    ):
        """Test response object creation"""
        # Mock database query for test_id
        mock_db.query.return_value.filter.return_value.count.return_value = 5

        response = market_test_service._create_response(
            sample_request,
            sample_gpt_response,
            "gpt-4-turbo-preview"
        )

        assert response.viability_score == 78.5
        assert response.market_size == MarketSize.MEDIUM
        assert response.gpt_model_used == "gpt-4-turbo-preview"
        assert isinstance(response.analysis_date, datetime)

    def test_cache_key_generation(self, market_test_service, sample_request):
        """Test cache key generation"""
        key1 = market_test_service._get_cache_key(sample_request)
        key2 = market_test_service._get_cache_key(sample_request)

        # Same request should produce same key
        assert key1 == key2
        assert len(key1) == 32  # MD5 hash length

        # Different request should produce different key
        sample_request.idea_description = "Different idea"
        key3 = market_test_service._get_cache_key(sample_request)
        assert key1 != key3


@pytest.mark.asyncio
async def test_get_user_tests(market_test_service, mock_db):
    """Test retrieving user's test history"""
    # Mock database response
    mock_test = Mock()
    mock_test.id = "test-id-123"
    mock_test.idea_description = "Test idea description for history"
    mock_test.viability_score = 75.0
    mock_test.market_size = "medium"
    mock_test.created_at = datetime.utcnow()

    mock_db.query.return_value.filter.return_value.order_by.return_value.limit.return_value.all.return_value = [mock_test]

    # Execute
    tests = await market_test_service.get_user_tests("test-user-123", limit=10)

    # Assertions
    assert len(tests) == 1
    assert tests[0]["viability_score"] == 75.0
    assert "Test idea" in tests[0]["idea_description"]
