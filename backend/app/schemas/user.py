from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    confirm: str

    @field_validator("confirm")
    @classmethod
    def passwords_match(cls, v: str, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6)


class EmailVerifyRequest(BaseModel):
    email: EmailStr
    code: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    password: str = Field(min_length=8, max_length=128)
    confirm: str

    @field_validator("confirm")
    @classmethod
    def passwords_match(cls, v: str, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class ChangePasswordRequest(BaseModel):
    current: str
    new_password: str = Field(min_length=8, max_length=128, alias="newPassword")
    confirm: str

    model_config = {"populate_by_name": True}


class ProfileUpdateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    avatar: str
    verified: bool
    two_fa_enabled: bool

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class LoginResponse(BaseModel):
    requires_2fa: bool
    email: str | None = None
    token: TokenResponse | None = None


class MessageResponse(BaseModel):
    message: str
