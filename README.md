# AI News

A modern, cyberpunk-styled news aggregation platform focused on artificial intelligence and machine learning content. Features real-time search, academic paper integration, and AI-generated summaries with a sleek dark theme and interactive UI elements.

## Features

### 📰 News Aggregation
- **Dual Content Sources**: Toggle between general AI news and academic papers
- **Real-time Search**: Fuzzy search powered by Fuse.js with debounced input
- **Smart Tagging**: Auto-generated topic tags extracted from article content
- **AI Summary**: Daily AI-generated news summary with cyberpunk styling

### 🎨 Cyberpunk UI/UX
- **Dark Theme**: Gradient background with neon accents
- **Interactive Elements**: Hover effects, smooth transitions, and animated components
- **Matrix Rain**: Optional Matrix-style background animation
- **Cyberpunk Loaders**: Multiple animated loading states
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 🔍 Advanced Search & Filtering
- **Fuzzy Search**: Intelligent search across titles and content
- **Tag-based Filtering**: Click tags to filter articles by topic
- **Auto-switching**: Automatically switches to academic view for academic-focused tags
- **Result Counter**: Live search result count display

### 📊 Data Management
- **Static Data**: Pre-loaded JSON data for fast initial render
- **Academic Integration**: ArXiv papers with key findings
- **Source Attribution**: Clear source and publication date display
- **External Links**: Direct links to original articles

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Styled Components
- **Search**: Fuse.js for fuzzy search
- **Icons**: Custom SVG icons
- **Analytics**: Vercel Analytics
- **Fonts**: Geist font family

## Project Structure

```
├── app/
│   ├── components/          # React components
│   │   ├── NewsCard.tsx    # Article display component
│   │   ├── SearchBar.tsx   # Search input component
│   │   ├── MatrixRain.tsx  # Matrix background effect
│   │   └── CyberpunkLoaders.tsx # Loading animations
│   ├── globals.css         # Global styles and animations
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main page component
├── lib/
│   └── registry.tsx        # Styled Components registry
├── public/
│   └── data/               # Static JSON data files
│       ├── news.json       # General AI news articles
│       ├── academic.json   # Academic papers
│       ├── summary.json    # AI-generated summary
│       └── meta.json       # Metadata (last updated, etc.)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ainews
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Navigation
- **Search Bar**: Type to search across all articles
- **News/Academic Toggle**: Switch between content types
- **Tag Filters**: Click generated tags to filter by topic
- **AI Summary**: Toggle daily AI-generated summary
- **Load More**: Paginate through articles (20 per page)

### Special Features
- **Matrix Easter Egg**: Search for "matrix" to trigger special redirect
- **Auto-tagging**: AI-related terms are automatically extracted and displayed as filterable tags
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## Data Sources

The application uses static JSON data files located in `public/data/`:
- **news.json**: General AI/ML news articles from various sources
- **academic.json**: Academic papers from ArXiv and other research sources
- **summary.json**: AI-generated daily summary of top stories
- **meta.json**: Metadata including last update timestamp

## Customization

### Styling
- Modify `app/globals.css` for global styles and animations
- Update `tailwind.config.ts` for Tailwind customization
- Edit component-specific styles in individual `.tsx` files

### Content
- Update JSON files in `public/data/` to change content
- Modify the AI_WORDS set in `app/page.tsx` to change tag extraction
- Adjust search parameters in Fuse.js configuration

### Components
- Add new components in `app/components/`
- Modify existing components for different layouts or functionality
- Update the main page logic in `app/page.tsx`

## Development

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Styled Components for complex styling
- Tailwind CSS for utility classes
- Clean, minimal code with descriptive function names

### Performance
- Static data loading for fast initial render
- Debounced search to prevent excessive API calls
- Memoized components and calculations
- Optimized bundle with Next.js

## Deployment

The application is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure build settings (Next.js framework)
3. Deploy automatically on push to main branch

Alternative deployment options:
- Netlify
- AWS Amplify
- Self-hosted with Docker

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Improvements

### 🚀 Core Features
- **Real-time Updates**: WebSocket integration for live news updates
- **User Accounts**: Authentication system with personalized feeds and bookmarks
- **AI-Powered Recommendations**: Machine learning to suggest relevant articles
- **Offline Support**: PWA capabilities with service workers for offline reading
- **Dark/Light Theme Toggle**: User preference for theme switching
- **Article Caching**: Local storage for faster loading and offline access

### 📊 Analytics & Insights
- **Reading Analytics**: Track reading patterns and popular topics
- **Trend Analysis**: Visualize trending topics over time
- **Sentiment Analysis**: AI-powered sentiment scoring for articles
- **Topic Clustering**: Group related articles automatically
- **Reading Time Estimates**: Display estimated reading time for each article

### 🔍 Enhanced Search & Discovery
- **Advanced Filters**: Date range, source, author, and topic filters
- **Saved Searches**: Save and manage custom search queries
- **Search Suggestions**: Auto-complete and search suggestions
- **Related Articles**: Show similar articles based on content
- **Search History**: Track and revisit previous searches

### 🤖 AI Integration
- **Custom Summaries**: Generate summaries for individual articles
- **Multi-language Support**: Translate articles and summaries
- **Content Moderation**: AI-powered content filtering
- **Smart Notifications**: Personalized news alerts based on interests
- **Chat Interface**: AI assistant for news queries and discussions

### 📱 Mobile & UX
- **Mobile App**: Native iOS/Android applications
- **Gesture Navigation**: Swipe gestures for article navigation
- **Voice Search**: Speech-to-text search functionality
- **Accessibility**: Screen reader support and keyboard navigation
- **Progressive Loading**: Infinite scroll with skeleton screens

### 🔧 Technical Enhancements
- **API Integration**: Connect to real news APIs (NewsAPI, Guardian, etc.)
- **Database Migration**: Move from static JSON to dynamic database
- **Caching Layer**: Redis for improved performance
- **CDN Integration**: Global content delivery for faster loading
- **Error Monitoring**: Sentry or similar for error tracking

### 📈 Content & Data
- **RSS Feed Integration**: Subscribe to multiple news sources
- **Content Curation**: Editorial team for quality control
- **User-Generated Content**: Comments and article discussions
- **Content Moderation**: Community-driven content filtering
- **Export Features**: PDF/EPUB export for articles

### 🌐 Social & Community
- **Social Sharing**: Share articles on social media platforms
- **User Profiles**: Public profiles with reading preferences
- **Community Features**: User discussions and article comments
- **Newsletter Integration**: Email digest subscriptions
- **Collaborative Filtering**: User-based recommendation system

### 🔒 Security & Privacy
- **GDPR Compliance**: Privacy controls and data protection
- **Content Security**: XSS and injection attack prevention
- **Rate Limiting**: API rate limiting and abuse prevention
- **Data Encryption**: End-to-end encryption for sensitive data
- **Privacy Dashboard**: User control over data collection

### 🎨 UI/UX Polish
- **Animation Library**: Framer Motion for advanced animations
- **Custom Themes**: Multiple cyberpunk theme variations
- **Keyboard Shortcuts**: Power user keyboard navigation
- **Customizable Layout**: Drag-and-drop dashboard customization
- **Micro-interactions**: Enhanced hover and click animations

### 📊 Performance & Scalability
- **Image Optimization**: WebP/AVIF support with lazy loading
- **Bundle Splitting**: Code splitting for faster initial loads
- **Edge Computing**: Vercel Edge Functions for global performance
- **Database Optimization**: Query optimization and indexing
- **Load Testing**: Performance testing and optimization

## License

This project is open source and available under the MIT License.
