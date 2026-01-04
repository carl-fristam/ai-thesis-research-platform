from pydantic import BaseModel

class SavedResult(BaseModel):
    title: str | None = None
    url: str
    text: str | None = None
    saved_at: str | None = None
    tags: list[str] = []
    is_favorite: bool = False
    note: str | None = None
    user_id: str | None = None

class SourceUpdate(BaseModel):
    tags: list[str] | None = None
    is_favorite: bool | None = None
    note: str | None = None
