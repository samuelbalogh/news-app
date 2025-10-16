'use client'

import { useState, useEffect, useMemo } from 'react'
import { NewsCard } from './components/NewsCard'
import styled from 'styled-components'
import Fuse from 'fuse.js'

interface NewsArticle {
  id?: number
  title: string
  body: string
  summary?: string | null
  source: string
  url: string
  published_at: string
}

const ContentContainer = styled.div`
  opacity: 0;
  animation: fadeIn 0.4s ease-in forwards;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
`

const Tag = styled.button<{ $isSelected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: ${props => props.$isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.3)'};
  border: 1px solid ${props => props.$isSelected ? 'rgb(59, 130, 246)' : 'rgba(51, 65, 85, 0.5)'};
  color: ${props => props.$isSelected ? 'rgb(219, 234, 254)' : 'rgb(148, 163, 184)'};
  transition: all 0.2s ease-in-out;
  box-shadow: ${props => props.$isSelected ? '0 0 10px rgba(59, 130, 246, 0.2)' : 'none'};

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgb(59, 130, 246);
  }
`

const AI_WORDS = new Set([
  'ai', 'machine', 'learning', 'neural', 'network', 'deep', 'learning', 'artificial intelligence', 'ai', 'machine', 'learning', 'neural', 'network',
  'nvidia', 'openai', 'google', 'meta', 'microsoft', 'apple', 'amazon', 'tesla', 'spacex', 'nasa',
  'nlp', 'llm', 'gpt', 'llama', 'chatgpt', 'gpt-4', 'gpt-3.5', 'gpt-3', 'gpt-2', 'gpt-1', 'gpt-0',
  'claude', 'groq', 'grok', 'grok-2', 'grok-1', 'grok-0', 'grok-0', 'grok-0', 'grok-0', 'grok-0',
  'transformer', 'bert', 'roberta', 'attention', 'reinforcement', 'vision', 'computer', 'mlops',
  'embeddings', 'vector', 'tensor', 'pytorch', 'tensorflow', 'keras', 'jax', 'huggingface', 'anthropic',
  'cohere', 'gemini', 'mistral', 'diffusion', 'stable', 'midjourney', 'dall-e', 'sora', 'multimodal',
  'rag', 'retrieval', 'augmented', 'generation', 'agentic', 'agent', 'fine-tuning', 'prompt', 'token',
  'tokenizer', 'semantic', 'reasoning', 'hallucination', 'bias', 'safety', 'alignment', 'ethics',
  'synthetic', 'data', 'dataset', 'training', 'inference', 'latency', 'quantization', 'bfloat16',
  'autoregressive', 'generative', 'foundation', 'model', 'modality', 'perplexity', 'parameter',
  'billion', 'trillion', 'mixtral', 'optimization', 'gradient', 'backpropagation'
])

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
  'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now', 'our',
  'your', 'their', 'there', 'here', 'what', 'which', 'who', 'whom', 'this', 'that',
  'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'whoever',
  'whomever', 'whatever', 'whichever', 'whoever', 'whomever', 'whatever', 'whichever',
  'you'
])

const MIN_WORD_LENGTH = 3
const MIN_WORD_FREQUENCY = 2

const extractTags = (articles: NewsArticle[]): string[] => {
  const wordFrequency = new Map<string, number>()

  articles.forEach(article => {
    const text = `${article.title} ${article.body}`.toLowerCase()
    const words = text.split(/\W+/)

    words.forEach(word => {
      if (
        word.length >= MIN_WORD_LENGTH &&
        !STOP_WORDS.has(word) &&
        !/^\d+$/.test(word) &&
        AI_WORDS.has(word)
      ) {
        wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1)
      }
    })
  })

  const sorted = Array.from(wordFrequency.entries())
    .filter(([, frequency]) => frequency >= MIN_WORD_FREQUENCY)
    .sort((a, b) => b[1] - a[1])

  const common = sorted.slice(0, 5).map(([word]) => word)
  const rare = sorted.slice(5, 8).map(([word]) => word)
  return [...common, ...rare]
}

// Import static data files
import newsData from '../public/data/news.json';
import academicData from '../public/data/academic.json';
import summaryData from '../public/data/summary.json';
import metaData from '../public/data/meta.json';

// Fetch data directly in the Server Component - but not with async/await style
export default function Home() {
  // Use empty arrays/null as fallbacks in case parsing fails
  let initialNews: NewsArticle[] = [];
  let initialAcademicNews: NewsArticle[] = [];
  let initialNewsSummary: string | null = null;
  let lastUpdated: string | null = null;

  try {
    // For static builds, use imported JSON files
    // This ensures the build completes even if the backend isn't available at build time
    initialNews = Array.isArray(newsData) ? newsData : [];
    initialAcademicNews = Array.isArray(academicData) ? academicData : [];
    initialNewsSummary = summaryData?.summary || null;
    lastUpdated = metaData?.last_updated || new Date().toISOString();
  } catch (error) {
    console.warn('Could not parse static data files:', error);
    // Continue with empty data - the UI will show appropriate messaging
  }

  // The rest of the component remains a Client Component
  // We pass the fetched data as props to a new Client Component Wrapper
  return (
    <HomeClientComponent
      initialNews={initialNews}
      initialAcademicNews={initialAcademicNews}
      initialNewsSummary={initialNewsSummary}
      lastUpdated={lastUpdated}
    />
  )
}

interface HomeClientProps {
  initialNews: NewsArticle[];
  initialAcademicNews: NewsArticle[];
  initialNewsSummary: string | null;
  lastUpdated: string | null;
}

// Create a new Client Component to hold the existing stateful logic
function HomeClientComponent({
  initialNews,
  initialAcademicNews,
  initialNewsSummary,
  lastUpdated
}: HomeClientProps) {
  // Keep UI state
  const [showAcademic, setShowAcademic] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [articlesToShow, setArticlesToShow] = useState(20)

  console.log("--- Rendering HomeClientComponent ---");

  // calculate tags whenever articles change
  useEffect(() => {
    const allArticles = [...initialNews, ...initialAcademicNews]
    if (allArticles.length > 0) {
      const extractedTags = extractTags(allArticles)
      setTags(extractedTags)
    }
  }, [initialNews, initialAcademicNews])

  // setup fuse instances for fuzzy search
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

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      // Ensure this runs only on the client
      if (typeof window !== 'undefined' && searchTerm.toLowerCase().includes('matrix')) {
        setTimeout(() => {
          window.location.href = 'https://samu.space/matrix/' // Access window only if defined
        }, 200)
        return
      }
      setDebouncedSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // filter articles based on search
  const filteredNews = useMemo(() => {
    let filtered = initialNews
    if (selectedTag) {
      filtered = filtered.filter(article =>
        (article.title?.toLowerCase() || '').includes(selectedTag.toLowerCase()) ||
        (article.body?.toLowerCase() || '').includes(selectedTag.toLowerCase())
      )
    }
    if (debouncedSearch) {
      return fuseNews.search(debouncedSearch).map(result => result.item)
    }
    return filtered
  }, [debouncedSearch, fuseNews, initialNews, selectedTag])

  const filteredAcademicNews = useMemo(() => {
    let filtered = initialAcademicNews
    if (selectedTag) {
      filtered = filtered.filter(article =>
        (article.title?.toLowerCase() || '').includes(selectedTag.toLowerCase()) ||
        (article.body?.toLowerCase() || '').includes(selectedTag.toLowerCase())
      )
    }
    if (debouncedSearch) {
      return fuseAcademic.search(debouncedSearch).map(result => result.item)
    }
    return filtered
  }, [debouncedSearch, fuseAcademic, initialAcademicNews, selectedTag])

  useEffect(() => {
    setArticlesToShow(20)
  }, [showAcademic, debouncedSearch, selectedTag])

  const visibleNews = useMemo(() => filteredNews.slice(0, articlesToShow), [filteredNews, articlesToShow])
  const visibleAcademic = useMemo(() => filteredAcademicNews.slice(0, articlesToShow), [filteredAcademicNews, articlesToShow])

  // Force re-render when switching between academic and news
  useEffect(() => {
    console.log('Toggle changed to:', showAcademic ? 'Academic' : 'News');
    console.log('Current visible articles:', showAcademic ? visibleAcademic.length : visibleNews.length);
  }, [showAcademic, visibleAcademic, visibleNews])

  // Render logic: Use initial data directly or show empty state
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
                onClick={() => {
                  const newTag = selectedTag === tag ? null : tag;
                  setSelectedTag(newTag);
                  if (newTag) {
                    const newsMatches = initialNews.filter(article =>
                      (article.title?.toLowerCase() || '').includes(newTag.toLowerCase()) ||
                      (article.body?.toLowerCase() || '').includes(newTag.toLowerCase())
                    );
                    const academicMatches = initialAcademicNews.filter(article =>
                      (article.title?.toLowerCase() || '').includes(newTag.toLowerCase()) ||
                      (article.body?.toLowerCase() || '').includes(newTag.toLowerCase())
                    );
                    if (newsMatches.length === 0 && academicMatches.length > 0 && !showAcademic) {
                      setShowAcademic(true);
                      console.log(`Switched to academic view for tag '${newTag}'`);
                    }
                  }
                }}
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
              className={`relative w-14 h-8 bg-slate-700/50 border border-slate-600 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
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
          {/* Display message if no data was fetched server-side */}
          {(!initialNews || initialNews.length === 0) && (!initialAcademicNews || initialAcademicNews.length === 0) && !showSummary && (
            <div className="text-center text-gray-400 py-10">
              No news articles available at the moment. The data might still be generating.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAcademic ? visibleAcademic : visibleNews).map((article, index) => {
              if (index < 3) {
                console.log(`Rendering article ${index + 1} in ${showAcademic ? 'Academic' : 'News'} mode:`, {
                  title: article.title,
                  source: article.source
                });
              }
              return (
                <NewsCard key={`${showAcademic ? 'academic' : 'news'}-${article.id || index}`} {...article} body={article.summary || article.body} />
              );
            })}
          </div>
          {((showAcademic ? filteredAcademicNews : filteredNews).length > articlesToShow) && (
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