import os
from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError, Field

# Load .env variables into environment
load_dotenv()


class AppSettings(BaseModel):
    db_connection_string: str = Field(..., alias="DB_CONNECTION_STRING")
    frontend_url: str = Field(..., alias="FRONTEND_URL")

    class Config:
        # Allow reading env vars directly
        populate_by_name = True


try:
    # Load directly from environment
    settings = AppSettings(**os.environ)
except ValidationError as e:
    print("❌ Environment variables have not been set properly:")
    print(e)
    raise SystemExit(1)
