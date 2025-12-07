import { NewsArticle } from './types'
import { AI_WORDS, STOP_WORDS, MIN_WORD_LENGTH, MIN_WORD_FREQUENCY } from './constants'

export function extractTags(articles: NewsArticle[]): string[] {
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

