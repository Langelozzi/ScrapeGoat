from pydantic import BaseModel, EmailStr

from app.shared.db.models.user import User


class UserCreateRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

    def to_user(self):
        return User(
            first_name=self.first_name,
            last_name=self.last_name,
            email=self.last_name,
            password_hash=self.password,
        )
