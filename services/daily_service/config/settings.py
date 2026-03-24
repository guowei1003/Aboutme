import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    app_env: str = os.getenv("APP_ENV", "dev")
    database_url: str = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://aboutme:aboutme@c-mysql:3306/aboutme",
    )
    redis_url: str = os.getenv("REDIS_URL", "redis://redis:6379/0")
    ai_model: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    ai_api_base: str = os.getenv("AI_API_BASE", "")
    ai_api_key: str = os.getenv("AI_API_KEY", "")
    robot_default_cron: str = os.getenv("ROBOT_DEFAULT_CRON", "0 9 * * *")


settings = Settings()
