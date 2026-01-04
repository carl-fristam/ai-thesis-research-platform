from fastapi import APIRouter, Depends
from app.api import deps
from app.models.knowledge import SavedResult, SourceUpdate
from app.services.knowledge_service import knowledge_service
from exa_py import Exa
from app.core.config import settings

router = APIRouter()
exa = Exa(api_key=settings.EXA_API_KEY)

@router.get("/exa-search")
async def exa_search(query: str, user_id: str = Depends(deps.get_current_user)):
    try:
        result = exa.search_and_contents(
            query,
            category="research paper",
            num_results=15,
            text=True,
            type="auto"
        )
        return result
    except Exception as e:
        # In production, log this properly
        return {"error": str(e)}

@router.get("/saved-results")
async def get_results(user_id: str = Depends(deps.get_current_user)):
    return await knowledge_service.get_results(user_id)

@router.post("/saved-results")
async def save_result(result: SavedResult, user_id: str = Depends(deps.get_current_user)):
    return await knowledge_service.save_result(result, user_id)

@router.put("/saved-results/{id}")
async def update_result(id: str, update: SourceUpdate, user_id: str = Depends(deps.get_current_user)):
    return await knowledge_service.update_result(id, update, user_id)

@router.delete("/saved-results/{id}")
async def delete_result(id: str, user_id: str = Depends(deps.get_current_user)):
    return await knowledge_service.delete_result(id, user_id)
