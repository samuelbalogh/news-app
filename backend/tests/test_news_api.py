from datetime import datetime
from app.models.news import News


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["status"] == "running"


def test_get_news_empty(client):
    response = client.get("/api/news")
    assert response.status_code == 200
    assert response.json() == []


def test_get_news_with_data(client, db_session):
    news_item = News(
        title="Test AI News",
        body="This is a test news body",
        summary="Test summary",
        source="Test Source",
        url="https://test.com/news1",
        published_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
        from_serper=True
    )
    db_session.add(news_item)
    db_session.commit()
    
    response = client.get("/api/news")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test AI News"
    assert data[0]["from_serper"] is True


def test_get_news_by_id(client, db_session):
    news_item = News(
        title="Test News",
        body="Body",
        summary="Summary",
        source="Source",
        url="https://test.com/news2",
        published_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    db_session.add(news_item)
    db_session.commit()
    
    response = client.get(f"/api/news/{news_item.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == news_item.id
    assert data["title"] == "Test News"


def test_get_news_by_id_not_found(client):
    response = client.get("/api/news/99999")
    assert response.status_code == 404


def test_get_news_pagination(client, db_session):
    for i in range(15):
        news_item = News(
            title=f"News {i}",
            body="Body",
            summary="Summary",
            source="Source",
            url=f"https://test.com/news{i}",
            published_at=datetime.utcnow(),
            created_at=datetime.utcnow()
        )
        db_session.add(news_item)
    db_session.commit()
    
    response = client.get("/api/news?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
    
    response = client.get("/api/news?skip=10&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5

