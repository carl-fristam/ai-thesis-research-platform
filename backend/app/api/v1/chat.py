from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.models.chat import ChatQuery, ChatSession
from app.services.chat_service import chat_service

router = APIRouter()

@router.get("/")
async def get_chats(type: str = None, user_id: str = Depends(deps.get_current_user)):
    return await chat_service.get_chats(user_id, type)

@router.post("/")
async def create_chat(chat: ChatSession, user_id: str = Depends(deps.get_current_user)):
    return await chat_service.create_chat(chat, user_id)

@router.delete("/{id}")
async def delete_chat(id: str, user_id: str = Depends(deps.get_current_user)):
    res = await chat_service.delete_chat(id, user_id)
    if "error" in res:
         raise HTTPException(status_code=400, detail=res["error"])
    return res

@router.post("/query")
async def chat_query(query: ChatQuery, user_id: str = Depends(deps.get_current_user)):
    return await chat_service.process_query(query, user_id)
