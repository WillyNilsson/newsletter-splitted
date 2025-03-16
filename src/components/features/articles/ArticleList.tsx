"use client"

import { useRef, useEffect } from "react"
import ArticleCard from "./ArticleCard"
import type { Article } from "../../../types"

interface ArticleListProps {
  articles: Article[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  onResetFilters: () => void
}

export default function ArticleList({ articles, loading, hasMore, onLoadMore, onResetFilters }: ArticleListProps) {
  const loaderRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(loaderRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, loading, onLoadMore])

  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-message">Inga artiklar matchar dina filter. Prova att ändra dina filterval.</p>
        <button className="reset-button" onClick={onResetFilters}>
          Återställ filter
        </button>
      </div>
    )
  }

  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {/* Loading indicator and intersection observer target */}
      <div ref={loaderRef} className="loader-container">
        {loading && <div className="spinner"></div>}
        {!hasMore && articles.length > 0 && <p className="end-message">Inga fler artiklar att visa</p>}
      </div>
    </div>
  )
}

