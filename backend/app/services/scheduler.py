import logging
import json
from pathlib import Path
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal
from app.services.news_fetcher import fetch_and_save_news
from app.models.news import News

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


async def scheduled_news_fetch():
    logger.info("Starting scheduled news fetch")
    db = SessionLocal()
    try:
        saved, duplicates = await fetch_and_save_news(db)
        logger.info(f"Scheduled fetch complete: {saved} new, {duplicates} duplicates")
        
        export_news_to_json(db)
    except Exception as e:
        logger.error(f"Error in scheduled fetch: {e}")
    finally:
        db.close()


def export_news_to_json(db: Session):
    try:
        news_items = db.query(News).order_by(News.created_at.desc()).all()
        
        news_data = []
        for item in news_items:
            news_data.append({
                "id": item.id,
                "title": item.title,
                "body": item.body,
                "summary": item.summary,
                "source": item.source,
                "url": item.url,
                "published_at": item.published_at.isoformat() if item.published_at else None,
                "created_at": item.created_at.isoformat() if item.created_at else None,
                "hn_id": item.hn_id,
                "score": item.score,
                "comments_count": item.comments_count,
                "priority": item.priority,
                "image_url": item.image_url,
                "search_position": item.search_position,
                "from_serper": item.from_serper
            })
        
        json_path = Path(settings.frontend_json_path)
        json_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(news_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Exported {len(news_data)} news items to {json_path}")
        
    except Exception as e:
        logger.error(f"Error exporting news to JSON: {e}")
        raise


def start_scheduler():
    hour = settings.scheduler_hour
    minute = settings.scheduler_minute
    
    def job_wrapper():
        import asyncio
        asyncio.run(scheduled_news_fetch())
    
    scheduler.add_job(
        job_wrapper,
        'cron',
        hour=hour,
        minute=minute,
        id='daily_news_fetch'
    )
    
    scheduler.start()
    logger.info(f"Scheduler started: daily fetch at {hour:02d}:{minute:02d}")


def shutdown_scheduler():
    scheduler.shutdown()
    logger.info("Scheduler shut down")

