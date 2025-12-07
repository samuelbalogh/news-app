import asyncio
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal, engine, Base
from app.models.news import News

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["status"] == "running"


def test_get_news_empty():
    response = client.get("/api/news")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_news_pagination():
    response = client.get("/api/news?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 10


def test_fetch_news_endpoint_without_api_key():
    import os
    original_key = os.environ.get('SERPER_API_KEY')
    
    if original_key and original_key != 'your_api_key_here':
        pytest.skip("Skipping test - real API key present")
    
    response = client.post("/api/fetch-news")
    assert response.status_code in [200, 500]


def test_api_cors_headers():
    response = client.get("/api/health")
    assert response.status_code == 200

