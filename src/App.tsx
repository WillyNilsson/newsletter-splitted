"use client"

import { useState } from "react"
import { useArticles } from "./hooks/useArticles"
import Header from "./components/layout/Header"
import Navigation from "./components/layout/Navigation"
import Footer from "./components/layout/Footer"
import NewsFeed from "./components/features/news/NewsFeed"
import UserFeed from "./components/features/userfeed/UserFeed"
import RegionalExplorer from "./components/features/regional/RegionalExplorer"
import { landscapes, userPosts } from "./data/mockData"
import type { Region } from "./types"
import "./app/styles.css"

export default function App() {
  const [activeTab, setActiveTab] = useState("feed")
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)

  const {
    displayedArticles,
    loading,
    hasMore,
    filters,
    allTopics,
    handleFilterChange,
    resetFilters,
    loadMoreArticles,
  } = useArticles(5)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
    handleFilterChange("region", region.name)
  }

  return (
    <div className="container">
      {/* Header */}
      <Header
        onTabChange={handleTabChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
        allTopics={allTopics}
        landscapes={landscapes}
      />

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <main className="main-content">
        {/* News Feed with Regional Sidebar */}
        {activeTab === "feed" && (
          <NewsFeed
            articles={displayedArticles}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMoreArticles}
            onResetFilters={resetFilters}
            regions={landscapes}
            selectedRegion={selectedRegion}
            onRegionSelect={handleRegionSelect}
          />
        )}

        {/* User Feed */}
        {activeTab === "userfeed" && <UserFeed posts={userPosts} />}

        {/* Regional Explorer */}
        {activeTab === "regional" && <RegionalExplorer regions={landscapes} />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

