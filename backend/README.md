# AI News Backend

FastAPI backend for AI/ML news aggregation using Serper API and PostgreSQL.

## Setup

### Prerequisites

- Python 3.11+
- Docker and Docker Compose
- uv (modern Python package manager)

### Installation

1. Install uv if you haven't already:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Start PostgreSQL:
```bash
cd /Users/samuelbalogh/news-app
docker compose up -d
```

3. Install dependencies:
```bash
cd backend
uv sync
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your Serper API key
```

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (default: `postgresql://newsuser:newspass@localhost:5433/newsdb`)
- `SERPER_API_KEY`: Your Serper API key (required)
- `FRONTEND_JSON_PATH`: Path to export JSON file (default: `../public/data/news.json`)
- `SCHEDULER_HOUR`: Hour for daily fetch (default: 2)
- `SCHEDULER_MINUTE`: Minute for daily fetch (default: 0)
- `MAX_SERPER_SEARCHES`: Maximum number of searches per run (default: 5)

## Running

### Development Server

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

### Manual News Fetch

To manually trigger a news fetch:

```bash
uv run python fetch_news.py
```

Or use the API endpoint:

```bash
curl -X POST http://localhost:8000/api/fetch-news
```

## API Endpoints

### News Endpoints

- `GET /api/news` - List all news items
  - Query params: `skip` (default: 0), `limit` (default: 100), `source` (optional)
  - Example: `GET /api/news?skip=0&limit=10`

- `GET /api/news/{id}` - Get specific news item by ID
  - Example: `GET /api/news/1`

- `POST /api/fetch-news` - Manually trigger news fetch
  - Returns: `{"status": "success", "saved": 10, "duplicates": 5}`

- `GET /api/health` - Health check endpoint
  - Returns: `{"status": "healthy"}`

### Root Endpoint

- `GET /` - API information
  - Returns: `{"message": "AI News API", "status": "running"}`

## Testing

Run the test suite:

```bash
uv run pytest tests/ -v
```

Run tests with coverage:

```bash
uv run pytest tests/ --cov=app --cov-report=html
```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       └── news.py          # API endpoints
│   ├── core/
│   │   ├── config.py           # Configuration settings
│   │   └── database.py         # Database connection
│   ├── models/
│   │   └── news.py             # SQLAlchemy models
│   ├── schemas/
│   │   └── news.py             # Pydantic schemas
│   ├── services/
│   │   ├── news_fetcher.py     # Serper API integration
│   │   └── scheduler.py        # APScheduler setup
│   └── main.py                 # FastAPI app
├── tests/
│   ├── conftest.py             # Test configuration
│   ├── test_news_api.py        # API tests
│   └── test_news_fetcher.py    # Fetcher tests
├── fetch_news.py               # Manual fetch script
├── pyproject.toml              # uv dependencies
└── .env                        # Environment variables
```

## Features

- **Automatic Daily Fetches**: Scheduler runs daily at configured time (default: 2 AM)
- **Rate Limiting**: Maximum 5 Serper searches per run to control API usage
- **Duplicate Detection**: Prevents duplicate news items based on URL
- **JSON Export**: Automatically exports news to frontend JSON file
- **REST API**: Full-featured API with pagination and filtering
- **CORS Enabled**: Ready for Next.js frontend integration
- **Comprehensive Tests**: Unit and integration tests included

## Database

The backend uses PostgreSQL 18 running in Docker. The database schema includes:

- `news` table with fields:
  - id, title, body, summary, source, url
  - published_at, created_at
  - hn_id, score, comments_count, priority
  - image_url, search_position, from_serper

## Troubleshooting

### Database Connection Issues

If you get connection errors, verify PostgreSQL is running:

```bash
docker compose ps
```

Check the logs:

```bash
docker compose logs postgres
```

### Serper API Issues

- Verify your API key is correct in `.env`
- Check rate limits (5 searches per run)
- Review logs for specific error messages

## Development

To add new dependencies:

```bash
uv add package-name
```

To add dev dependencies:

```bash
uv add --dev package-name
```

