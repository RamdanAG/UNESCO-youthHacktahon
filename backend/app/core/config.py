from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_key: str = ""
    ollama_host: str = "http://localhost:11434"
    jwt_secret: str = "change-me"

    class Config:
        env_file = ".env"


settings = Settings()