from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "GridLock"
    environment: str = "development"
    debug: bool = True

    secret_key: str = "change-this-to-a-long-random-secret-in-production"
    access_token_expire_minutes: int = 60
    algorithm: str = "HS256"

    database_url: str = "sqlite:///./gridlock.db"

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    max_login_attempts: int = 5
    lockout_minutes: int = 15

    otp_expire_minutes: int = 5

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
