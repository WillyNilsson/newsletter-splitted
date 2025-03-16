import type { Article, ArticlesData } from "../types"
import { getAssetPath } from "../utils/path-utils"

// Fetch articles from API or fallback to mock data
export async function fetchArticles(): Promise<Article[]> {
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
        const localResponse = await fetch(getAssetPath("/mock-articles.json"))
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

    return articlesData
  } catch (error) {
    console.error("Error in fetchArticles:", error)
    return []
  }
}

// Format date for display
export function formatDate(dateString: string, format: "short" | "long" = "short"): string {
  const date = new Date(dateString)

  if (format === "short") {
    return new Intl.DateTimeFormat("sv-SE", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// Get score color class based on positivity score
export function getScoreColorClass(score: number): string {
  if (score >= 0.9) return "score-badge score-badge-high"
  if (score >= 0.8) return "score-badge score-badge-medium"
  if (score >= 0.7) return "score-badge score-badge-low"
  return "score-badge"
}

