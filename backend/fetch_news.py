import asyncio
import logging

from app.core.database import SessionLocal
from app.services.news_fetcher import fetch_and_save_news
from app.services.scheduler import export_news_to_json

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


async def main():
    logger.info("Starting manual news fetch")
    db = SessionLocal()
    
    try:
        saved, duplicates = await fetch_and_save_news(db)
        logger.info(f"Fetch complete: {saved} new items, {duplicates} duplicates")
        
        export_news_to_json(db)
        logger.info("News exported to JSON successfully")
        
    except Exception as e:
        logger.error(f"Error during fetch: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(main())

