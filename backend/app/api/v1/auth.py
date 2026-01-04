from fastapi import APIRouter
from app.models.auth import UserCredentials, Token
from app.services.auth_service import auth_service

router = APIRouter()

@router.post("/register")
async def register(auth_details: UserCredentials):
    return await auth_service.register_user(auth_details)

@router.post("/login", response_model=Token)
async def login(auth_details: UserCredentials):
    return await auth_service.authenticate_user(auth_details)
