import ArticleList from "../articles/ArticleList"
import RegionalSidebar from "../sidebar/RegionalSidebar"
import type { Article, Region } from "../../../types"

interface NewsFeedProps {
  articles: Article[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  onResetFilters: () => void
  regions: Region[]
  selectedRegion: Region | null
  onRegionSelect: (region: Region) => void
}

export default function NewsFeed({
  articles,
  loading,
  hasMore,
  onLoadMore,
  onResetFilters,
  regions,
  selectedRegion,
  onRegionSelect,
}: NewsFeedProps) {
  return (
    <div className="content-layout">
      {/* Main News Feed */}
      <div className="main-column">
        <h2 className="page-title">Senaste positiva nyheterna</h2>
        <ArticleList
          articles={articles}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          onResetFilters={onResetFilters}
        />
      </div>

      {/* Regional Sidebar */}
      <RegionalSidebar regions={regions} selectedRegion={selectedRegion} onRegionSelect={onRegionSelect} />
    </div>
  )
}

