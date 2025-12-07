from datetime import datetime, UTC
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean

from app.core.database import Base


class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    source = Column(String, nullable=False)
    url = Column(String, nullable=False, unique=True)
    published_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)
    hn_id = Column(Integer, nullable=True)
    score = Column(Integer, nullable=True)
    comments_count = Column(Integer, nullable=True)
    priority = Column(Integer, nullable=True)
    image_url = Column(String, nullable=True)
    search_position = Column(Integer, nullable=True)
    from_serper = Column(Boolean, default=False, nullable=True)

