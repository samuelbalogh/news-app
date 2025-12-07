import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.news import News
from app.schemas.news import NewsResponse
from app.services.news_fetcher import fetch_and_save_news
from app.services.scheduler import export_news_to_json

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/news", response_model=List[NewsResponse])
def get_news(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    source: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(News)
    
    if source:
        query = query.filter(News.source == source)
    
    news_items = query.order_by(News.created_at.desc()).offset(skip).limit(limit).all()
    return news_items


@router.get("/news/{news_id}", response_model=NewsResponse)
def get_news_by_id(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    
    if not news:
        raise HTTPException(status_code=404, detail="News item not found")
    
    return news


@router.post("/fetch-news")
async def trigger_news_fetch(db: Session = Depends(get_db)):
    try:
        logger.info("Manual news fetch triggered")
        saved, duplicates = await fetch_and_save_news(db)
        
        export_news_to_json(db)
        
        return {
            "status": "success",
            "saved": saved,
            "duplicates": duplicates,
            "message": f"Fetched news: {saved} new items, {duplicates} duplicates"
        }
    except Exception as e:
        logger.error(f"Error in manual fetch: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
def health_check():
    return {"status": "healthy"}

