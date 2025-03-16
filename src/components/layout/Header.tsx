"use client"

import { Filter, Search } from "lucide-react"
import GladstartLogo from "../ui/GladstartLogo"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { FilterState } from "../../types"
import type { Region } from "../../types"

interface HeaderProps {
  onTabChange: (tab: string) => void
  filters: FilterState
  onFilterChange: (filterType: string, value: string) => void
  onResetFilters: () => void
  allTopics: string[]
  landscapes: Region[]
}

export default function Header({
  onTabChange,
  filters,
  onFilterChange,
  onResetFilters,
  allTopics,
  landscapes,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <button onClick={() => onTabChange("feed")} className="logo-button">
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
                      onChange={(e) => onFilterChange("region", e.target.value)}
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
                          onClick={() => onFilterChange("topics", topic)}
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
                      onChange={(e) => onFilterChange("minScore", e.target.value)}
                      className="range-input"
                    />
                  </div>
                </div>

                <div className="button-group">
                  <button className="button button-secondary" onClick={onResetFilters}>
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
}

