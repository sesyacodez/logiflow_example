# JWT authentication routes for token-based API security
"""Auth API endpoints."""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from app.shared.config import settings


router = APIRouter()


class LoginInput(BaseModel):
    email: EmailStr
    password: str


@router.post("/login")
async def login(data: LoginInput) -> dict:
    """Exchange credentials for JWT tokens."""
    return {
        "access_token": "mock-jwt-token-access",
        "refresh_token": "mock-jwt-token-refresh",
        "token_type": "Bearer",
        "user": {
            "id": "uuid-1",
            "email": data.email,
            "role": "dispatcher" # dispatcher, warehouse, or manager
        }
    }


@router.post("/refresh")
async def refresh_token() -> dict:
    """Exchange a valid refresh token for a new access token."""
    return {
        "access_token": "new-mock-jwt-token-access",
        "token_type": "Bearer"
    }
