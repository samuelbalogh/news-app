# Architecture Overview

## Clean, DRY Implementation

This application follows Next.js 13+ App Router best practices with a clear separation between server and client components.

### Project Structure

```
news-app/
├── app/
│   ├── page.tsx                    # Server Component (async data fetching)
│   └── components/
│       └── HomeClient.tsx          # Client Component (interactivity)
├── lib/
│   ├── api.ts                      # API client with fallback
│   ├── types.ts                    # Shared TypeScript types
│   ├── constants.ts                # Shared constants (AI_WORDS, STOP_WORDS)
│   ├── utils.ts                    # Shared utility functions
│   └── styles.tsx                  # Shared styled-components
└── backend/
    └── app/                        # FastAPI backend
```

## Component Architecture

### Server Component (page.tsx)
- **Purpose**: Data fetching on the server
- **Benefits**:
  - SEO-friendly (content available to crawlers)
  - Fast initial load (rendered on server)
  - Secure (API calls happen server-side)
  - Automatic static generation at build time

```tsx
// app/page.tsx - Server Component
export default async function Home() {
  const data = await fetchNewsWithFallback()  // Server-side fetch
  return <HomeClientComponent data={data} />   // Pass to client
}
```

### Client Component (HomeClient.tsx)
- **Purpose**: User interactivity and state management
- **Features**:
  - React hooks (useState, useEffect, useMemo)
  - Event handlers
  - Browser APIs (window, localStorage)
- **Marked with**: `'use client'` directive at top of file

```tsx
// app/components/HomeClient.tsx
'use client'

export function HomeClientComponent({ data }) {
  const [state, setState] = useState()  // Client-side state
  // ... interactive features
}
```

## Data Flow

### Build Time (Static Generation)
```
1. Next.js runs page.tsx on server
2. fetchNewsWithFallback() tries API (likely fails during build)
3. Falls back to static JSON files
4. Generates static HTML with data
5. Ships to CDN/hosting
```

### Runtime (User Visits)
```
1. User requests page
2. Server runs page.tsx
3. fetchNewsWithFallback() tries API (3-second timeout)
   - Success: Use fresh data from backend
   - Timeout/Error: Use static JSON fallback
4. Server renders HTML with data
5. Client hydrates with interactivity
6. User can search, filter, interact
```

## API Integration Pattern

### Resilient Fetch with Timeout
```typescript
// lib/api.ts
export async function fetchNewsWithFallback() {
  try {
    // Try API with 3-second timeout
    const data = await fetchWithTimeout(API_URL, 3000)
    return data
  } catch {
    // Fallback to static JSON
    return await import('../public/data/news.json')
  }
}
```

### Why This Works
1. **Fast Loading**: 3-second timeout prevents slow API from blocking page
2. **Always Available**: Static fallback ensures site always works
3. **Fresh Data**: When backend is healthy, users get latest news
4. **Build Success**: Static JSON allows builds without running backend

## Code Organization (DRY Principles)

### Shared Modules

**types.ts** - Single source of truth for TypeScript interfaces
```typescript
export interface NewsArticle { ... }
```

**constants.ts** - Centralized configuration
```typescript
export const AI_WORDS = new Set([...])
export const STOP_WORDS = new Set([...])
```

**utils.ts** - Reusable business logic
```typescript
export function extractTags(articles) { ... }
```

**styles.tsx** - Reusable styled-components
```typescript
export const Tag = styled.button<{$isSelected}>
```

### Benefits
- **No Duplication**: Each piece of code exists in one place
- **Easy Updates**: Change constant in one file, affects whole app
- **Type Safety**: Shared types prevent inconsistencies
- **Testability**: Pure functions easy to test in isolation

## Backend Integration

### Daily News Fetching
```
Backend (FastAPI) --[fetch]-> Serper API
       |
       ├─> Save to PostgreSQL
       └─> Export to public/data/news.json
```

### Manual Trigger
```bash
# Via CLI
cd backend && uv run python fetch_news.py

# Via API
curl -X POST http://localhost:8000/api/fetch-news
```

## Performance Optimizations

1. **Static Generation**: Pre-render pages at build time
2. **Server Components**: Reduce client-side JavaScript bundle
3. **useMemo/useCallback**: Prevent unnecessary re-renders
4. **Fuzzy Search**: Fuse.js for fast client-side search
5. **Lazy Loading**: Load more articles on demand
6. **API Timeout**: Don't wait forever for slow APIs

## Testing Strategy

### Backend
- Unit tests for business logic
- Integration tests for API endpoints
- Mock database for fast tests

### Frontend
- Component tests (if needed in future)
- E2E tests for critical flows
- Type checking with TypeScript

## Deployment Considerations

### Frontend
- Deploy to Vercel/Netlify/etc
- Static files served from CDN
- API calls happen at runtime

### Backend
- Run on server (not serverless for scheduler)
- PostgreSQL container
- Environment variables for config

### Environment Variables
```
# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Backend
DATABASE_URL=postgresql://...
SERPER_API_KEY=your_key
```

## Summary

This architecture achieves:
- ✅ **Clean Code**: No duplication, clear separation of concerns
- ✅ **DRY Principles**: Shared modules, single source of truth
- ✅ **Performance**: Static generation + server components
- ✅ **Resilience**: Multiple fallback layers
- ✅ **Maintainability**: Easy to understand and modify
- ✅ **Best Practices**: Follows Next.js 13+ patterns

