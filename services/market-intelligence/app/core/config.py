"""
Market Intelligence Service Configuration
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""

    # API Configuration
    APP_NAME: str = "Market Intelligence Service"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8004

    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/pueblo_mente"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    OPENAI_MAX_TOKENS: int = 4000
    OPENAI_TEMPERATURE: float = 0.7

    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 3600  # 1 hour

    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://pueblo-mente.vercel.app"
    ]

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Web Scraping
    PLAYWRIGHT_HEADLESS: bool = True
    SCRAPING_TIMEOUT: int = 30000  # 30 seconds
    MAX_CONCURRENT_SCRAPES: int = 5

    # Feature Flags
    ENABLE_WEB_SCRAPING: bool = True
    ENABLE_DALLE_GENERATION: bool = True
    ENABLE_CACHING: bool = True
    CACHE_TTL: int = 3600  # 1 hour

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
