import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, validator

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # API Keys
    SERP_API_KEY: str = Field(..., description="SerpAPI key is required for reverse image search.")

    # CORS
    CORS_ALLOWED_ORIGINS: str = Field(
        default="http://localhost:3000",
        description="Comma-separated list of allowed CORS origins"
    )

    # Magic Numbers & Configuration
    ELA_MAX_DIM: int = Field(default=512, description="Maximum dimension for ELA image resizing")
    ELA_QUALITY: int = Field(default=90, description="JPEG quality for ELA generation")
    MAX_FILE_SIZE_MB: int = Field(default=20, description="Maximum file upload size in MB")
    
    # Environment
    ENVIRONMENT: str = Field(default="production", description="Runtime environment (development, staging, production)")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ALLOWED_ORIGINS.split(",") if origin.strip()]

try:
    settings = Settings()
except Exception as e:
    import sys
    print(f"CRITICAL ERROR: Failed to load configuration. {e}")
    sys.exit(1)
