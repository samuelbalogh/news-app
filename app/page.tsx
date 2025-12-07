import { HomeClientComponent } from './components/HomeClient'
import { fetchNewsWithFallback } from '../lib/api'
import { NewsArticle } from '../lib/types'
import academicData from '../public/data/academic.json'
import summaryData from '../public/data/summary.json'
import metaData from '../public/data/meta.json'

export default async function Home() {
  let initialNews: NewsArticle[] = []
  let initialAcademicNews: NewsArticle[] = []
  let initialNewsSummary: string | null = null
  let lastUpdated: string | null = null

  try {
    initialNews = await fetchNewsWithFallback()
    initialAcademicNews = Array.isArray(academicData) ? academicData : []
    initialNewsSummary = summaryData?.summary || null
    lastUpdated = metaData?.last_updated || new Date().toISOString()
  } catch (error) {
    console.warn('Could not load data:', error)
  }

  return (
    <HomeClientComponent
      initialNews={initialNews}
      initialAcademicNews={initialAcademicNews}
      initialNewsSummary={initialNewsSummary}
      lastUpdated={lastUpdated}
    />
  )
}
