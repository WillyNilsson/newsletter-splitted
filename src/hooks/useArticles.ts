"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import type { Article, FilterState } from "../types"
import { fetchArticles } from "../services/articleService"

export function useArticles(articlesPerPage = 5) {
  const [articles, setArticles] = useState<Article[]>([])
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    region: "all",
    topics: [],
    sources: [],
    minScore: 0.7,
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // Load articles on component mount
  useEffect(() => {
    const loadArticles = async () => {
      const data = await fetchArticles()
      setArticles(data)
    }

    loadArticles()
  }, [])

  // Filter articles based on current filters
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
      const startIndex = (nextPage - 1) * articlesPerPage
      const endIndex = nextPage * articlesPerPage

      if (endIndex >= filteredArticles.length) {
        setHasMore(false)
      }

      setDisplayedArticles((prev) => [...prev, ...filteredArticles.slice(startIndex, endIndex)])
      setPage(nextPage)
      setLoading(false)
    }, 500)
  }, [filteredArticles, loading, page, articlesPerPage])

  // Initialize displayed articles when filtered articles change
  useEffect(() => {
    if (articles.length > 0 && !isInitialized) {
      setDisplayedArticles(filteredArticles.slice(0, articlesPerPage))
      setPage(1)
      setHasMore(filteredArticles.length > articlesPerPage)
      setIsInitialized(true)
    }
  }, [filteredArticles, articles, isInitialized, articlesPerPage])

  // Reset pagination when filters change
  useEffect(() => {
    if (isInitialized) {
      setDisplayedArticles(filteredArticles.slice(0, articlesPerPage))
      setPage(1)
      setHasMore(filteredArticles.length > articlesPerPage)
    }
  }, [filters, filteredArticles, isInitialized, articlesPerPage])

  // Handle filter changes
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

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      region: "all",
      topics: [],
      sources: [],
      minScore: 0.7,
    })
  }

  // Get all unique topics from articles
  const allTopics = useMemo(() => {
    return Array.from(new Set(articles.flatMap((article) => article.topics.map((topic) => topic.name))))
  }, [articles])

  return {
    articles,
    displayedArticles,
    filteredArticles,
    loading,
    hasMore,
    filters,
    allTopics,
    handleFilterChange,
    resetFilters,
    loadMoreArticles,
  }
}

