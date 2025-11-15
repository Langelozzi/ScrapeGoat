from pydantic import BaseModel
from typing import Optional

class AuthUser(BaseModel):
    user_id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None