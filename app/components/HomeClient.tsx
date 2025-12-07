'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'
import { NewsCard } from './NewsCard'
import { NewsArticle } from '../../lib/types'
import { extractTags } from '../../lib/utils'
import { ContentContainer, TagContainer, Tag } from '../../lib/styles'

interface HomeClientProps {
    initialNews: NewsArticle[]
    initialAcademicNews: NewsArticle[]
    initialNewsSummary: string | null
    lastUpdated: string | null
}

export function HomeClientComponent({
    initialNews,
    initialAcademicNews,
    initialNewsSummary,
    lastUpdated
}: HomeClientProps) {
    const [showAcademic, setShowAcademic] = useState(false)
    const [showSummary, setShowSummary] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [tags, setTags] = useState<string[]>([])
    const [articlesToShow, setArticlesToShow] = useState(20)

    useEffect(() => {
        const allArticles = [...initialNews, ...initialAcademicNews]
        if (allArticles.length > 0) {
            setTags(extractTags(allArticles))
        }
    }, [initialNews, initialAcademicNews])

    const fuseNews = useMemo(() => new Fuse(initialNews, {
        keys: ['title', 'body'],
        threshold: 0.3,
        distance: 100
    }), [initialNews])

    const fuseAcademic = useMemo(() => new Fuse(initialAcademicNews, {
        keys: ['title', 'body'],
        threshold: 0.3,
        distance: 100
    }), [initialAcademicNews])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && searchTerm.toLowerCase().includes('matrix')) {
                setTimeout(() => {
                    window.location.href = 'https://samu.space/matrix/'
                }, 200)
                return
            }
            setDebouncedSearch(searchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const filterArticles = useCallback((articles: NewsArticle[]) => {
        if (!selectedTag) return articles

        return articles.filter(article =>
            (article.title?.toLowerCase() || '').includes(selectedTag.toLowerCase()) ||
            (article.body?.toLowerCase() || '').includes(selectedTag.toLowerCase())
        )
    }, [selectedTag])

    const filteredNews = useMemo(() => {
        const filtered = filterArticles(initialNews)
        return debouncedSearch
            ? fuseNews.search(debouncedSearch).map(result => result.item)
            : filtered
    }, [debouncedSearch, fuseNews, initialNews, filterArticles])

    const filteredAcademicNews = useMemo(() => {
        const filtered = filterArticles(initialAcademicNews)
        return debouncedSearch
            ? fuseAcademic.search(debouncedSearch).map(result => result.item)
            : filtered
    }, [debouncedSearch, fuseAcademic, initialAcademicNews, filterArticles])

    useEffect(() => {
        setArticlesToShow(20)
    }, [showAcademic, debouncedSearch, selectedTag])

    const visibleNews = useMemo(() => filteredNews.slice(0, articlesToShow), [filteredNews, articlesToShow])
    const visibleAcademic = useMemo(() => filteredAcademicNews.slice(0, articlesToShow), [filteredAcademicNews, articlesToShow])

    const handleTagClick = (tag: string) => {
        const newTag = selectedTag === tag ? null : tag
        setSelectedTag(newTag)

        if (newTag) {
            const newsMatches = filterArticles(initialNews)
            const academicMatches = filterArticles(initialAcademicNews)

            if (newsMatches.length === 0 && academicMatches.length > 0 && !showAcademic) {
                setShowAcademic(true)
            }
        }
    }

    const currentArticles = showAcademic ? visibleAcademic : visibleNews
    const currentFiltered = showAcademic ? filteredAcademicNews : filteredNews

    return (
        <main className="gradient-bg min-h-screen">
            <nav className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">ai news</h1>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-12">
                <div className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-800/30 rounded-xl border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-200 placeholder-gray-400"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {filteredNews.length + filteredAcademicNews.length} results
                        </div>
                    </div>
                    <TagContainer>
                        {tags.map(tag => (
                            <Tag
                                key={tag}
                                $isSelected={selectedTag === tag}
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </TagContainer>
                    <p className="mt-2 text-xs text-gray-500 text-right italic">
                        how deep does the rabbit hole go? try searching for &quot;matrix&quot;...
                    </p>
                </div>
                <div className="flex justify-center my-4">
                    <div className="flex items-center">
                        <span className={`mr-2 text-sm ${!showAcademic ? 'text-blue-300' : 'text-slate-400'}`}>News</span>
                        <button
                            onClick={() => setShowAcademic(!showAcademic)}
                            className="relative w-14 h-8 bg-slate-700/50 border border-slate-600 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            aria-pressed={showAcademic}
                            aria-label="Toggle academic/news"
                        >
                            <span
                                className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-all duration-300 ${showAcademic ? 'translate-x-6 bg-cyan-400' : 'translate-x-0 bg-blue-400'}`}
                                style={{ boxShadow: '0 0 8px rgba(59,130,246,0.3)' }}
                            />
                        </button>
                        <span className={`ml-2 text-sm ${showAcademic ? 'text-cyan-300' : 'text-slate-400'}`}>Academic</span>
                    </div>
                </div>
                <div className="flex justify-center my-4">
                    <button
                        onClick={() => setShowSummary(!showSummary)}
                        className={`px-4 py-2 rounded-full border transition-all duration-300 ${showSummary ? 'bg-purple-600/50 border-purple-400' : 'bg-slate-700/50 border-slate-600 hover:bg-purple-600/30'}`}
                    >
                        {showSummary ? 'Hide Summary' : 'Show AI Summary'}
                    </button>
                </div>
                {showSummary && initialNewsSummary && (
                    <div className="mb-8 p-6 bg-purple-900/30 border border-purple-700 rounded-lg shadow-lg max-w-2xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-4 text-purple-300 text-center">your daily ai news summary</h2>
                        <p className="text-purple-100 whitespace-pre-line text-center">{initialNewsSummary}</p>
                    </div>
                )}
            </div>

            <ContentContainer>
                <div className="container mx-auto px-6 pb-12">
                    {(!initialNews || initialNews.length === 0) && (!initialAcademicNews || initialAcademicNews.length === 0) && !showSummary && (
                        <div className="text-center text-gray-400 py-10">
                            No news articles available at the moment. The data might still be generating.
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentArticles.map((article, index) => (
                            <NewsCard
                                key={`${showAcademic ? 'academic' : 'news'}-${article.id || index}`}
                                {...article}
                                body={article.summary || article.body}
                            />
                        ))}
                    </div>
                    {currentFiltered.length > articlesToShow && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setArticlesToShow(articlesToShow + 20)}
                                className="px-6 py-2 rounded-full bg-blue-700/70 text-blue-100 border border-blue-400 hover:bg-blue-800/80 transition-all"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>

                <footer className="text-center text-xs text-gray-500 py-4">
                    Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Loading...'}
                </footer>
            </ContentContainer>
        </main>
    )
}
