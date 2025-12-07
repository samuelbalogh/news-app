import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import news
from app.core.database import engine, Base
from app.services.scheduler import start_scheduler, shutdown_scheduler

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up application")
    Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield
    logger.info("Shutting down application")
    shutdown_scheduler()


app = FastAPI(
    title="AI News API",
    description="Backend API for AI/ML news aggregation",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news.router, prefix="/api", tags=["news"])


@app.get("/")
def root():
    return {"message": "AI News API", "status": "running"}

