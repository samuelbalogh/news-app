from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    database_url: str = "postgresql://newsuser:newspass@localhost:5433/newsdb"
    serper_api_key: str
    frontend_json_path: str = "../public/data/news.json"
    scheduler_hour: int = 2
    scheduler_minute: int = 0
    max_serper_searches: int = 5


settings = Settings()

