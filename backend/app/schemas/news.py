from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NewsBase(BaseModel):
    title: str
    body: str
    summary: str
    source: str
    url: str
    published_at: datetime
    hn_id: Optional[int] = None
    score: Optional[int] = None
    comments_count: Optional[int] = None
    priority: Optional[int] = None
    image_url: Optional[str] = None
    search_position: Optional[int] = None
    from_serper: Optional[bool] = None


class NewsCreate(NewsBase):
    pass


class NewsResponse(NewsBase):
    id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}

