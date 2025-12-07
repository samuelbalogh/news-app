import pytest
from datetime import datetime, UTC
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.core.database import Base, get_db
from app.main import app
from app.models.news import News
from app.schemas.news import NewsCreate

TEST_DATABASE_URL = "postgresql://newsuser:newspass@localhost:5433/newsdb"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_news_data():
    return {
        "title": "AI Breakthrough in Natural Language Processing",
        "body": "Researchers have achieved a significant breakthrough in natural language processing.",
        "summary": "New NLP model shows impressive results",
        "source": "hackernews",
        "url": "https://example.com/ai-breakthrough",
        "published_at": datetime.now(UTC),
        "hn_id": 12345,
        "score": 150,
        "comments_count": 42,
        "priority": 1,
        "image_url": "https://example.com/image.jpg",
        "search_position": 1,
        "from_serper": False
    }


def test_database_connection(db_session):
    result = db_session.execute(text("SELECT 1"))
    assert result.scalar() == 1


def test_schema_creation(db_session):
    from sqlalchemy import inspect
    
    inspector = inspect(db_session.bind)
    tables = inspector.get_table_names()
    assert "news" in tables
    
    columns = {col["name"] for col in inspector.get_columns("news")}
    expected_columns = {
        "id", "title", "body", "summary", "source", "url", 
        "published_at", "created_at", "hn_id", "score", 
        "comments_count", "priority", "image_url", 
        "search_position", "from_serper"
    }
    assert expected_columns.issubset(columns)


def test_insert_single_news(db_session, sample_news_data):
    news = News(**sample_news_data)
    db_session.add(news)
    db_session.commit()
    db_session.refresh(news)
    
    assert news.id is not None
    assert news.title == sample_news_data["title"]
    assert news.body == sample_news_data["body"]
    assert news.created_at is not None


def test_query_news_by_id(db_session, sample_news_data):
    news = News(**sample_news_data)
    db_session.add(news)
    db_session.commit()
    db_session.refresh(news)
    
    queried_news = db_session.query(News).filter(News.id == news.id).first()
    
    assert queried_news is not None
    assert queried_news.id == news.id
    assert queried_news.title == sample_news_data["title"]
    assert queried_news.url == sample_news_data["url"]


def test_query_news_by_source(db_session, sample_news_data):
    news1 = News(**sample_news_data)
    db_session.add(news1)
    
    news2_data = sample_news_data.copy()
    news2_data["url"] = "https://example.com/different-url"
    news2_data["source"] = "serper"
    news2 = News(**news2_data)
    db_session.add(news2)
    
    db_session.commit()
    
    hackernews_items = db_session.query(News).filter(News.source == "hackernews").all()
    assert len(hackernews_items) == 1
    assert hackernews_items[0].source == "hackernews"
    
    serper_items = db_session.query(News).filter(News.source == "serper").all()
    assert len(serper_items) == 1
    assert serper_items[0].source == "serper"


def test_insert_multiple_news(db_session, sample_news_data):
    news_items = []
    for i in range(5):
        news_data = sample_news_data.copy()
        news_data["url"] = f"https://example.com/news-{i}"
        news_data["title"] = f"News Title {i}"
        news = News(**news_data)
        news_items.append(news)
    
    db_session.add_all(news_items)
    db_session.commit()
    
    count = db_session.query(News).count()
    assert count == 5


def test_unique_url_constraint(db_session, sample_news_data):
    news1 = News(**sample_news_data)
    db_session.add(news1)
    db_session.commit()
    
    news2 = News(**sample_news_data)
    db_session.add(news2)
    
    with pytest.raises(Exception):
        db_session.commit()
    
    db_session.rollback()


def test_update_news(db_session, sample_news_data):
    news = News(**sample_news_data)
    db_session.add(news)
    db_session.commit()
    db_session.refresh(news)
    
    news.score = 200
    news.comments_count = 100
    db_session.commit()
    
    updated_news = db_session.query(News).filter(News.id == news.id).first()
    assert updated_news.score == 200
    assert updated_news.comments_count == 100


def test_delete_news(db_session, sample_news_data):
    news = News(**sample_news_data)
    db_session.add(news)
    db_session.commit()
    news_id = news.id
    
    db_session.delete(news)
    db_session.commit()
    
    deleted_news = db_session.query(News).filter(News.id == news_id).first()
    assert deleted_news is None


def test_order_by_created_at(db_session, sample_news_data):
    news_items = []
    for i in range(3):
        news_data = sample_news_data.copy()
        news_data["url"] = f"https://example.com/news-{i}"
        news = News(**news_data)
        db_session.add(news)
        db_session.commit()
        db_session.refresh(news)
        news_items.append(news)
    
    ordered_news = db_session.query(News).order_by(News.created_at.desc()).all()
    
    assert len(ordered_news) == 3
    for i in range(len(ordered_news) - 1):
        assert ordered_news[i].created_at >= ordered_news[i + 1].created_at


def test_pagination(db_session, sample_news_data):
    for i in range(10):
        news_data = sample_news_data.copy()
        news_data["url"] = f"https://example.com/news-{i}"
        news = News(**news_data)
        db_session.add(news)
    
    db_session.commit()
    
    page1 = db_session.query(News).offset(0).limit(5).all()
    assert len(page1) == 5
    
    page2 = db_session.query(News).offset(5).limit(5).all()
    assert len(page2) == 5
    
    assert page1[0].id != page2[0].id


def test_get_news_endpoint(client, db_session, sample_news_data):
    news = News(**sample_news_data)
    db_session.add(news)
    db_session.commit()
    
    response = client.get("/api/news")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == sample_news_data["title"]


def test_get_news_by_id_endpoint(client, db_session, sample_news_data):
    news = News(**sample_news_data)
    db_session.add(news)
    db_session.commit()
    db_session.refresh(news)
    
    response = client.get(f"/api/news/{news.id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == news.id
    assert data["title"] == sample_news_data["title"]


def test_get_news_by_id_not_found(client):
    response = client.get("/api/news/999999")
    assert response.status_code == 404


def test_get_news_with_source_filter(client, db_session, sample_news_data):
    news1 = News(**sample_news_data)
    db_session.add(news1)
    
    news2_data = sample_news_data.copy()
    news2_data["url"] = "https://example.com/different-url"
    news2_data["source"] = "serper"
    news2 = News(**news2_data)
    db_session.add(news2)
    
    db_session.commit()
    
    response = client.get("/api/news?source=hackernews")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["source"] == "hackernews"


def test_get_news_with_pagination(client, db_session, sample_news_data):
    for i in range(10):
        news_data = sample_news_data.copy()
        news_data["url"] = f"https://example.com/news-{i}"
        news = News(**news_data)
        db_session.add(news)
    
    db_session.commit()
    
    response = client.get("/api/news?skip=0&limit=5")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 5


def test_health_check_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_nullable_fields(db_session, sample_news_data):
    minimal_data = {
        "title": sample_news_data["title"],
        "body": sample_news_data["body"],
        "summary": sample_news_data["summary"],
        "source": sample_news_data["source"],
        "url": "https://example.com/minimal",
        "published_at": sample_news_data["published_at"],
    }
    
    news = News(**minimal_data)
    db_session.add(news)
    db_session.commit()
    db_session.refresh(news)
    
    assert news.id is not None
    assert news.hn_id is None
    assert news.score is None
    assert news.image_url is None

