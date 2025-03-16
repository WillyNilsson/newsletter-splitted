"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Filter, Search, Users, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import ArticleCard from "./article-card"
import GladstartLogo from "./gladstart-logo"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import "../app/styles.css"

// Swedish landscapes for our regional explorer
const landscapes = [
  { id: 1, name: "Uppland", positivity: 0.91, articles: 98 },
  { id: 3, name: "Skåne", positivity: 0.79, articles: 156 },
  { id: 6, name: "Småland", positivity: 0.81, articles: 68 },
  { id: 7, name: "Halland", positivity: 0.84, articles: 65 },
  { id: 8, name: "Närke", positivity: 0.77, articles: 62 },
  { id: 9, name: "Dalarna", positivity: 0.75, articles: 58 },
  { id: 12, name: "Blekinge", positivity: 0.8, articles: 45 },
]

interface Article {
  id: number
  title: string
  summary: string
  source: { id: number; name: string }
  published_date: string
  positivity_score: number
  topics: { id: number; name: string }[]
  region: string
  image_url: string
  url: string
}

interface ArticlesData {
  articles: Article[]
}

export default function GladStartApp() {
  const [activeTab, setActiveTab] = useState("feed")
  const [articles, setArticles] = useState<Article[]>([])
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState({
    region: "all",
    topics: [] as string[],
    sources: [] as string[],
    minScore: 0.7,
  })
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const ARTICLES_PER_PAGE = 5
  const [isInitialized, setIsInitialized] = useState(false)

  // Fetch articles from API or fallback to JSON file
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let articlesData: Article[] = []
        let fetchSuccessful = false

        // First try to fetch from the API
        try {
          const apiResponse = await fetch("https://gladstart.com/api/newsarticles", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          // If API call is successful, use that data
          if (apiResponse.ok) {
            const apiData: ArticlesData = await apiResponse.json()
            articlesData = apiData.articles
            fetchSuccessful = true
            console.log("Successfully fetched articles from API")
          }
        } catch (apiError) {
          console.error("API fetch failed:", apiError)
        }

        // If API call fails, fallback to local JSON file
        if (!fetchSuccessful) {
          try {
            const localResponse = await fetch("/mock-articles.json")
            if (localResponse.ok) {
              const localData: ArticlesData = await localResponse.json()
              articlesData = localData.articles
              fetchSuccessful = true
              console.log("Successfully fetched articles from mock JSON")
            } else {
              throw new Error("Failed to fetch mock data")
            }
          } catch (localError) {
            console.error("Local JSON fetch failed:", localError)
            throw new Error("Failed to fetch articles from both API and mock data")
          }
        }

        setArticles(articlesData)
      } catch (error) {
        console.error("Error in fetchArticles:", error)
        // If both API and local JSON fail, show an error but don't set empty articles
        setArticles([])
      }
    }

    fetchArticles()
  }, [])

  // Memoize filtered articles to prevent recalculation on every render
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Filter by region
      if (filters.region !== "all" && article.region !== filters.region) {
        return false
      }

      // Filter by sources
      if (filters.sources.length > 0 && !filters.sources.includes(article.source.name)) {
        return false
      }

      // Filter by topics
      if (filters.topics.length > 0 && !article.topics.some((topic) => filters.topics.includes(topic.name))) {
        return false
      }

      // Filter by positivity score
      if (article.positivity_score < filters.minScore) {
        return false
      }

      return true
    })
  }, [articles, filters])

  // Load more articles when scrolling
  const loadMoreArticles = useCallback(() => {
    if (loading) return

    setLoading(true)

    setTimeout(() => {
      const nextPage = page + 1
      const startIndex = (nextPage - 1) * ARTICLES_PER_PAGE
      const endIndex = nextPage * ARTICLES_PER_PAGE

      if (endIndex >= filteredArticles.length) {
        setHasMore(false)
      }

      setDisplayedArticles((prev) => [...prev, ...filteredArticles.slice(startIndex, endIndex)])
      setPage(nextPage)
      setLoading(false)
    }, 500)
  }, [filteredArticles, loading, page, ARTICLES_PER_PAGE])

  // Initialize displayed articles when filtered articles change
  useEffect(() => {
    if (articles.length > 0 && !isInitialized) {
      setDisplayedArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE))
      setPage(1)
      setHasMore(filteredArticles.length > ARTICLES_PER_PAGE)
      setIsInitialized(true)
    }
  }, [filteredArticles, articles, isInitialized])

  // Reset pagination when filters change
  useEffect(() => {
    if (isInitialized) {
      setDisplayedArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE))
      setPage(1)
      setHasMore(filteredArticles.length > ARTICLES_PER_PAGE)
    }
  }, [filters, filteredArticles, isInitialized])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreArticles()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(loaderRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, loading, loadMoreArticles])

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => {
      // Handle array-based filters
      if (filterType === "topics" || filterType === "sources") {
        const currentValues = [...prev[filterType as "topics" | "sources"]]
        const index = currentValues.indexOf(value)

        // If value exists, remove it, otherwise add it
        if (index !== -1) {
          currentValues.splice(index, 1)
        } else {
          currentValues.push(value)
        }

        return { ...prev, [filterType]: currentValues }
      }

      // Handle simple value filters
      return { ...prev, [filterType]: value }
    })
  }

  const resetFilters = () => {
    setFilters({
      region: "all",
      topics: [],
      sources: [],
      minScore: 0.7,
    })
  }

  const allTopics = useMemo(() => {
    return Array.from(new Set(articles.flatMap((article) => article.topics.map((topic) => topic.name))))
  }, [articles])

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "score-badge score-badge-high"
    if (score >= 0.8) return "score-badge score-badge-medium"
    if (score >= 0.7) return "score-badge score-badge-low"
    return "score-badge"
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Update all title headings to use the brown color
  const headerSection = (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <button onClick={() => setActiveTab("feed")} className="logo-button">
            <GladstartLogo />
          </button>

          <div className="header-actions">
            <Popover>
              <PopoverTrigger asChild>
                <button className="icon-button">
                  <Filter size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="popover-content">
                <div className="popover-header">
                  <span className="popover-title">Filter</span>
                  <div className="badge">Kommer snart</div>
                </div>

                <div className="form-groups">
                  {/* Region Filter */}
                  <div className="form-group">
                    <label className="form-label">Region</label>
                    <select
                      className="form-select"
                      value={filters.region}
                      onChange={(e) => handleFilterChange("region", e.target.value)}
                    >
                      <option value="all">Alla regioner</option>
                      {landscapes.map((region) => (
                        <option key={region.id} value={region.name}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Topics Filter */}
                  <div className="form-group">
                    <label className="form-label">Ämnen</label>
                    <div className="tag-container">
                      {allTopics.slice(0, 6).map((topic) => (
                        <button
                          key={topic}
                          className={filters.topics.includes(topic) ? "tag tag-active" : "tag tag-inactive"}
                          onClick={() => handleFilterChange("topics", topic)}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Positivity Score Filter */}
                  <div className="form-group">
                    <label className="form-label">Positivitetsgrad: {Math.round(filters.minScore * 100)}%+</label>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.05"
                      value={filters.minScore}
                      onChange={(e) => handleFilterChange("minScore", e.target.value)}
                      className="range-input"
                    />
                  </div>
                </div>

                <div className="button-group">
                  <button className="button button-secondary" onClick={resetFilters}>
                    Återställ
                  </button>
                  <button className="button button-primary">Tillämpa filter</button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="icon-button">
                  <Search size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="popover-content">
                <div className="popover-header">
                  <span className="popover-title">Sök</span>
                  <div className="badge">Kommer snart</div>
                </div>
                <input type="text" placeholder="Sök efter nyheter..." className="form-select" disabled />
                <div
                  style={{
                    height: "8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6f4e37",
                  }}
                >
                  Sökfunktionen kommer snart
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  )

  const sidebarSection = (
    <div className="sidebar-column">
      <div className="sidebar">
        <h3 className="sidebar-title">Sveriges Landskap</h3>
        <div className="sidebar-list">
          {landscapes.slice(0, 6).map((region) => (
            <button
              key={region.id}
              className={`sidebar-item ${selectedRegion?.id === region.id ? "active" : ""}`}
              onClick={() => {
                setSelectedRegion(region)
                handleFilterChange("region", region.name)
              }}
            >
              <div className="sidebar-item-content">
                <span className="sidebar-item-label">{region.name}</span>
                <span className={getScoreColor(region.positivity)}>+{Math.round(region.positivity * 100)}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const footerSection = (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-form">
            <iframe
              src="https://gladstart.curated.co/embed?color1=f5efe7&color2=4a3520&color_bg_button=e67e22&color_border=f39c12&color_button=ffffff&color_links=6f4e37&color_terms=967259&title=Join+GladStart+%F0%9F%98%8A+"
              width="100%"
              height="310"
              frameBorder="0"
              style={{ maxWidth: "100%" }}
              title="GladStart Newsletter"
            ></iframe>
          </div>
          <div className="social-links">
            <a
              href="https://www.facebook.com/profile.php?id=61574156665429"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://x.com/TheGladStart" target="_blank" rel="noopener noreferrer" className="social-link">
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://www.instagram.com/thegladstart/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://www.linkedin.com/company/106882021/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )

  return (
    <div className="container">
      {/* Header */}
      {headerSection}

      {/* Navigation Tabs */}
      <div className="nav-container">
        <div className="nav-content">
          <nav className="nav-tabs">
            <button className={`nav-tab ${activeTab === "feed" ? "active" : ""}`} onClick={() => setActiveTab("feed")}>
              Nyhetsfeed
            </button>
            <button
              className={`nav-tab ${activeTab === "regional" ? "active" : ""}`}
              onClick={() => setActiveTab("regional")}
            >
              Regionalt
            </button>
            <button
              className={`nav-tab ${activeTab === "userfeed" ? "active" : ""}`}
              onClick={() => setActiveTab("userfeed")}
            >
              Användare
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* News Feed with Regional Sidebar */}
        {activeTab === "feed" && (
          <div className="content-layout">
            {/* Main News Feed */}
            <div className="main-column">
              <h2 className="page-title">Senaste positiva nyheterna</h2>

              {filteredArticles.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-message">Inga artiklar matchar dina filter. Prova att ändra dina filterval.</p>
                  <button className="reset-button" onClick={resetFilters}>
                    Återställ filter
                  </button>
                </div>
              ) : (
                <div className="article-list">
                  {displayedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}

                  {/* Loading indicator and intersection observer target */}
                  <div ref={loaderRef} className="loader-container">
                    {loading && <div className="spinner"></div>}
                    {!hasMore && displayedArticles.length > 0 && (
                      <p className="end-message">Inga fler artiklar att visa</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Regional Sidebar - Aligned with articles, not the heading */}
            {sidebarSection}
          </div>
        )}

        {/* User Feed */}
        {activeTab === "userfeed" && (
          <div>
            <div className="popover-header" style={{ marginBottom: "1.5rem" }}>
              <h2 className="page-title">Användarinlägg</h2>
              <div className="badge">Kommer snart</div>
            </div>

            <div className="sidebar" style={{ marginBottom: "1.5rem" }}>
              <div className="user-input-container">
                <div className="avatar-placeholder">
                  <Users size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <input type="text" placeholder="Dela något positivt..." className="user-input" disabled />
                </div>
                <button className="post-button">Dela</button>
              </div>

              <div className="user-posts">
                {[
                  {
                    id: 1,
                    username: "AnnaS",
                    avatar: "/placeholder.svg?height=40&width=40",
                    date: "2025-03-14",
                    title: "Fantastisk soluppgång vid Turning Torso",
                    content: "Vaknade tidigt för att fånga denna magiska morgon i Malmö. Vilken start på dagen! 🌅",
                    image: "/placeholder.svg?height=400&width=600",
                    likes: 124,
                    comments: 23,
                    shares: 12,
                  },
                  {
                    id: 2,
                    username: "ErikL",
                    avatar: "/placeholder.svg?height=40&width=40",
                    date: "2025-03-13",
                    title: "Lokalt initiativ för renare stränder",
                    content:
                      "Idag samlade vi över 50 personer för att städa Ribersborgsstranden. Tillsammans gör vi skillnad! 💪🌊",
                    image: "/placeholder.svg?height=400&width=600",
                    video: "/placeholder.mp4",
                    likes: 89,
                    comments: 15,
                    shares: 8,
                  },
                ].map((post) => (
                  <div key={post.id} className="user-post">
                    <div className="post-header">
                      <img
                        src={post.avatar || "/placeholder.svg"}
                        alt={post.username}
                        width={40}
                        height={40}
                        style={{ borderRadius: "9999px" }}
                      />
                      <div className="post-content">
                        <div className="post-meta">
                          <h4 className="post-author">{post.username}</h4>
                          <span className="post-date">{formatDate(post.date)}</span>
                        </div>
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-text">{post.content}</p>

                        {post.image && (
                          <div className="post-image">
                            <img src={post.image || "/placeholder.svg"} alt={post.title} />
                          </div>
                        )}

                        {post.video && (
                          <div
                            className="post-image"
                            style={{
                              aspectRatio: "16/9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f3f4f6",
                            }}
                          >
                            <div style={{ color: "#6b7280" }}>Video kommer snart</div>
                          </div>
                        )}

                        <div className="post-actions">
                          <div className="action-buttons">
                            <button className="action-button">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              <span>{post.likes}</span>
                            </button>
                            <button className="action-button">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span>{post.comments}</span>
                            </button>
                            <button className="action-button">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                              </svg>
                              <span>Dela</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regional Explorer */}
        {activeTab === "regional" && (
          <div>
            <div className="popover-header" style={{ marginBottom: "1.5rem" }}>
              <h2 className="page-title">Utforska efter landskap</h2>
              <div className="badge">Kommer snart</div>
            </div>

            <div className="region-grid">
              {landscapes.map((region) => (
                <div key={region.id} className="region-card">
                  <div className="region-header">
                    <h3 className="region-name">{region.name}</h3>
                    <span className={getScoreColor(region.positivity)}>+{Math.round(region.positivity * 100)}%</span>
                  </div>
                  <p className="region-stats">{region.articles} positiva artiklar</p>
                  <button className="region-button">Utforska landskap</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer with Curated Form */}
      {footerSection}
    </div>
  )
}

