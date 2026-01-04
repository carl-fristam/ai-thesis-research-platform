from fastapi import HTTPException, status
from app.core import security
from app.core.database import db
from app.models.auth import UserCredentials

class AuthService:
    def __init__(self):
        self.collection = db.get_collection("users")

    async def register_user(self, credentials: UserCredentials):
        existing_user = await self.collection.find_one({"username": credentials.username})
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        hashed_pwd = security.get_password_hash(credentials.password)
        await self.collection.insert_one({
            "username": credentials.username, 
            "password": hashed_pwd
        })
        return {"message": "User created"}

    async def authenticate_user(self, credentials: UserCredentials):
        user = await self.collection.find_one({"username": credentials.username})
        if not user or not security.verify_password(credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        token = security.create_access_token(data={"sub": credentials.username})
        return {"access_token": token, "token_type": "bearer"}

auth_service = AuthService()
