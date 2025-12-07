# AI News Application

A Next.js frontend with FastAPI backend for aggregating AI/ML news using the Serper API.

## Project Structure

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI with PostgreSQL 18, SQLAlchemy, APScheduler
- **Database**: PostgreSQL 18 running in Docker

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Set Up Backend

```bash
cd backend
uv sync
cp .env.example .env
# Edit .env and add your Serper API key
```

### 3. Run Backend

```bash
cd backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be available at http://localhost:8000

### 4. Run Frontend

```bash
npm install
npm run dev
```

Frontend will be available at http://localhost:3000

## Features

### Backend

- **Automatic Daily News Fetching**: Scheduler runs daily at 2 AM (configurable)
- **Rate Limited**: Maximum 5 Serper searches per run to control API usage
- **REST API**: Full-featured API with pagination and filtering
- **JSON Export**: Automatically exports news to frontend JSON files
- **Duplicate Detection**: Prevents duplicate news items based on URL

### Frontend

- **API Integration with Fallback**: Tries to fetch from backend API (3-second timeout), falls back to static JSON
- **Fuzzy Search**: Search articles using Fuse.js
- **Tag Filtering**: Auto-extracted tags from article content
- **Academic/News Toggle**: Switch between news sources
- **Infinite Scroll**: Load more functionality
- **AI Summary**: View daily AI-generated news summaries

## Manual News Fetch

To manually fetch news (backend must be running):

```bash
cd backend
uv run python fetch_news.py
```

Or via API:

```bash
curl -X POST http://localhost:8000/api/fetch-news
```

## Environment Variables

### Backend (.env in backend directory)

```
DATABASE_URL=postgresql://newsuser:newspass@localhost:5433/newsdb
SERPER_API_KEY=your_api_key_here
FRONTEND_JSON_PATH=../public/data/news.json
SCHEDULER_HOUR=2
SCHEDULER_MINUTE=0
MAX_SERPER_SEARCHES=5
```

### Frontend (optional)

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Endpoints

- `GET /api/news` - List all news items (with pagination)
- `GET /api/news/{id}` - Get specific news item
- `POST /api/fetch-news` - Manually trigger news fetch
- `GET /api/health` - Health check

## Testing

Backend tests:

```bash
cd backend
uv run pytest tests/ -v
```

## Development

### Adding Backend Dependencies

```bash
cd backend
uv add package-name
```

### Adding Frontend Dependencies

```bash
npm install package-name
```

## Architecture

The application uses a hybrid approach:

1. **Build Time**: Frontend uses static JSON files for SSG (Static Site Generation)
2. **Runtime**: Frontend attempts to fetch from backend API first
3. **Fallback**: If API is unavailable or slow (>3s), falls back to static JSON
4. **Daily Updates**: Backend scheduler fetches new data daily and updates both database and JSON files

This ensures:
- Fast initial page loads (static generation)
- Fresh data when backend is available
- Resilience when backend is down
- Historical data storage in PostgreSQL

## Documentation

- [Backend Documentation](backend/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## License

This project is open source.
