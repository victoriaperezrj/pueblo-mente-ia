"""
Pytest configuration and shared fixtures
"""
import pytest
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))


@pytest.fixture(scope="session")
def test_settings():
    """Test settings override"""
    from app.core.config import Settings

    return Settings(
        DATABASE_URL="postgresql://test:test@localhost:5432/test_db",
        REDIS_HOST="localhost",
        OPENAI_API_KEY="test-key",
        ENABLE_CACHING=False,
        ENABLE_WEB_SCRAPING=False,
        ENABLE_DALLE_GENERATION=False
    )
