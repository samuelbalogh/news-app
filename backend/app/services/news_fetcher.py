import logging
from datetime import datetime
from typing import List
import httpx

from app.core.config import settings
from app.schemas.news import NewsCreate

logger = logging.getLogger(__name__)


class NewsFetcher:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://google.serper.dev/search"
        self.max_searches = settings.max_serper_searches
        
    async def fetch_news(self) -> List[NewsCreate]:
        search_queries = [
            "AI artificial intelligence",
            "machine learning",
            "LLM large language model",
            "deep learning",
            "neural networks"
        ][:self.max_searches]
        
        all_news = []
        logger.info(f"Starting news fetch with {len(search_queries)} searches")
        
        async with httpx.AsyncClient() as client:
            for idx, query in enumerate(search_queries, 1):
                try:
                    logger.info(f"Search {idx}/{len(search_queries)}: {query}")
                    news_items = await self._search_query(client, query, idx)
                    all_news.extend(news_items)
                    logger.info(f"Found {len(news_items)} items for query: {query}")
                except Exception as e:
                    logger.error(f"Error fetching news for query '{query}': {e}")
        
        logger.info(f"Total news items fetched: {len(all_news)}")
        return all_news
    
    async def _search_query(self, client: httpx.AsyncClient, query: str, position: int) -> List[NewsCreate]:
        headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "q": query,
            "num": 10
        }
        
        try:
            response = await client.post(
                self.base_url,
                json=payload,
                headers=headers,
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            return self._parse_serper_response(data, position)
            
        except httpx.HTTPError as e:
            logger.error(f"HTTP error occurred: {e}")
            raise
    
    def _parse_serper_response(self, data: dict, search_position: int) -> List[NewsCreate]:
        news_items = []
        organic_results = data.get("organic", [])
        
        for result in organic_results:
            try:
                news_item = NewsCreate(
                    title=result.get("title", "No title"),
                    body=result.get("snippet", "No content"),
                    summary=result.get("snippet", "No summary")[:200],
                    source=result.get("source", "Unknown"),
                    url=result.get("link", ""),
                    published_at=self._parse_date(result.get("date")),
                    hn_id=None,
                    score=None,
                    comments_count=None,
                    priority=2,
                    image_url=result.get("imageUrl"),
                    search_position=search_position,
                    from_serper=True
                )
                news_items.append(news_item)
            except Exception as e:
                logger.warning(f"Failed to parse result: {e}")
                continue
        
        return news_items
    
    def _parse_date(self, date_str: str | None) -> datetime:
        from datetime import UTC
        
        if not date_str:
            return datetime.now(UTC)
        
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except (ValueError, AttributeError):
            return datetime.now(UTC)


async def fetch_and_save_news(db_session):
    from app.models.news import News
    
    fetcher = NewsFetcher(settings.serper_api_key)
    news_items = await fetcher.fetch_news()
    
    saved_count = 0
    duplicate_count = 0
    
    for news_data in news_items:
        existing = db_session.query(News).filter(News.url == news_data.url).first()
        
        if existing:
            duplicate_count += 1
            continue
        
        news = News(**news_data.model_dump())
        db_session.add(news)
        saved_count += 1
    
    db_session.commit()
    logger.info(f"Saved {saved_count} new items, skipped {duplicate_count} duplicates")
    
    return saved_count, duplicate_count

