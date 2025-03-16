import { MapPin } from "lucide-react"
import LazyImage from "./lazy-image"
import "../app/styles.css"

interface Topic {
  id: number
  name: string
}

interface Source {
  id: number
  name: string
}

interface Article {
  id: number
  title: string
  summary: string
  source: Source
  published_date: string
  positivity_score: number
  topics: Topic[]
  region: string
  image_url: string
  url: string
}

interface ArticleCardProps {
  article: Article
}

// Update the article card to use regular CSS instead of Tailwind
export default function ArticleCard({ article }: ArticleCardProps) {
  // Function to determine the color based on positivity score
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "score-badge score-badge-high"
    if (score >= 0.8) return "score-badge score-badge-medium"
    if (score >= 0.7) return "score-badge score-badge-low"
    return "score-badge"
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("sv-SE", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="article-card"
      style={{
        display: "block",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        marginBottom: "1rem",
      }}
    >
      {article.image_url && (
        <LazyImage
          src={article.image_url}
          alt={article.title}
          className="article-image"
          style={{ height: "16rem", width: "100%" }}
        />
      )}

      <div style={{ padding: "1rem" }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}
        >
          <span style={{ fontSize: "0.875rem", color: "#6f4e37" }}>{article.source.name}</span>
          <span
            className={getScoreColor(article.positivity_score)}
            style={{ padding: "0.25rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem" }}
          >
            +{Math.round(article.positivity_score * 100)}%
          </span>
        </div>

        <h3 style={{ fontWeight: "500", fontSize: "1.25rem", marginBottom: "0.75rem", color: "#4a3520" }}>
          {article.title}
        </h3>

        <p style={{ color: "#6f4e37", fontSize: "1rem", marginBottom: "1rem" }}>{article.summary}</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "#967259" }}>{formatDate(article.published_date)}</span>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {article.region && (
              <span style={{ display: "flex", alignItems: "center", fontSize: "0.75rem", color: "#967259" }}>
                <MapPin size={12} style={{ marginRight: "0.25rem" }} />
                {article.region}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}

