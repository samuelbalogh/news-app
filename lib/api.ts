import { NewsArticle } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_TIMEOUT = 3000

export async function fetchNewsWithFallback(): Promise<NewsArticle[]> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch(`${API_BASE_URL}/api/news?limit=1000`, {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched news from API:', data.length, 'items');
        return data;

    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.warn('API request timed out after 3 seconds, falling back to static JSON');
            } else {
                console.warn('API request failed, falling back to static JSON:', error.message);
            }
        }

        try {
            const newsData = await import('../public/data/news.json');
            return Array.isArray(newsData.default) ? newsData.default as NewsArticle[] : [];
        } catch (fallbackError) {
            console.error('Failed to load fallback data:', fallbackError);
            return [];
        }
    }
}

export async function checkApiHealth(): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${API_BASE_URL}/api/health`, {
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch {
        return false;
    }
}

