# End-to-End Test Plan

## Prerequisites
1. Backend running on http://localhost:8000
2. Frontend running on http://localhost:3000
3. Database populated with news data

## Test Scenarios

### 1. Backend Health Check
- URL: http://localhost:8000/api/health
- Expected: `{"status": "healthy"}`

### 2. News API Endpoint
- URL: http://localhost:8000/api/news
- Expected: Array of news articles with proper schema

### 3. Frontend Loads News
- Navigate to http://localhost:3000
- Verify articles are displayed
- Check console for errors
- Verify network requests to backend

### 4. Search Functionality
- Type in search box
- Verify results filter correctly
- Check for console errors

### 5. Backend Integration
- Verify frontend makes server-side calls to backend
- Check that fresh data is loaded from API
- Verify fallback works when backend is down

## Success Criteria
- All API endpoints return 200 status
- Frontend displays data from backend
- No console errors
- Search and filtering work correctly

