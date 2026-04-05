from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str
    full_name: str | None = None
    is_admin: bool = False

class TokenPayload(BaseModel):
    sub: str | None = None
