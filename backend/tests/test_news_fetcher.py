from datetime import datetime
import pytest
from app.services.news_fetcher import NewsFetcher


def test_news_fetcher_initialization():
    fetcher = NewsFetcher("test_api_key")
    assert fetcher.api_key == "test_api_key"
    assert fetcher.max_searches == 5


def test_parse_date_valid_iso():
    fetcher = NewsFetcher("test_key")
    date_str = "2025-10-17T12:00:00Z"
    result = fetcher._parse_date(date_str)
    assert isinstance(result, datetime)


def test_parse_date_none():
    fetcher = NewsFetcher("test_key")
    result = fetcher._parse_date(None)
    assert isinstance(result, datetime)


def test_parse_date_invalid():
    fetcher = NewsFetcher("test_key")
    result = fetcher._parse_date("invalid_date")
    assert isinstance(result, datetime)


def test_parse_serper_response():
    fetcher = NewsFetcher("test_key")
    mock_data = {
        "organic": [
            {
                "title": "AI Breakthrough",
                "snippet": "This is a test snippet about AI",
                "source": "TechNews",
                "link": "https://example.com/ai-news",
                "date": "2025-10-17T12:00:00Z"
            }
        ]
    }
    
    results = fetcher._parse_serper_response(mock_data, 1)
    assert len(results) == 1
    assert results[0].title == "AI Breakthrough"
    assert results[0].source == "TechNews"
    assert results[0].from_serper is True
    assert results[0].search_position == 1


def test_parse_serper_response_empty():
    fetcher = NewsFetcher("test_key")
    mock_data = {"organic": []}
    
    results = fetcher._parse_serper_response(mock_data, 1)
    assert len(results) == 0

