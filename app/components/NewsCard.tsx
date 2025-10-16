// Remove 'use client' - no longer needed after removing document access
// 'use client' 

import he from 'he'; // Import the 'he' library

interface NewsArticleProps {
    title: string
    body: string
    source: string
    url: string
    published_at: string
}

export function NewsCard({ title, body, source, url, published_at }: NewsArticleProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="p-6 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3">{he.decode(title || '')}</h3>
            <p className="text-gray-400 mb-4 line-clamp-3">{he.decode(body || '')}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{source} • {formatDate(published_at)}</span>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-sm"
                >
                    read more
                </a>
            </div>
        </div>
    )
} 