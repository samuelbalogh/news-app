export interface NewsArticle {
    id?: number
    title: string
    body: string
    summary?: string | null
    source: string
    url: string
    published_at: string
    created_at?: string
    hn_id?: number | null
    score?: number | null
    comments_count?: number | null
    priority?: number | null
    image_url?: string | null
    search_position?: number | null
    from_serper?: boolean | null
}

