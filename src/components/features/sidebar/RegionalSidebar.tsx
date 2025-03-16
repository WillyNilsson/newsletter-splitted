"use client"
import type { Region } from "../../../types"
import { getScoreColorClass } from "../../../services/articleService"

interface RegionalSidebarProps {
  regions: Region[]
  onRegionSelect: (region: Region) => void
  selectedRegion: Region | null
}

export default function RegionalSidebar({ regions, onRegionSelect, selectedRegion }: RegionalSidebarProps) {
  return (
    <div className="sidebar-column">
      <div className="sidebar">
        <h3 className="sidebar-title">Sveriges Landskap</h3>
        <div className="sidebar-list">
          {regions.slice(0, 6).map((region) => (
            <button
              key={region.id}
              className={`sidebar-item ${selectedRegion?.id === region.id ? "active" : ""}`}
              onClick={() => onRegionSelect(region)}
            >
              <div className="sidebar-item-content">
                <span className="sidebar-item-label">{region.name}</span>
                <span className={getScoreColorClass(region.positivity)}>+{Math.round(region.positivity * 100)}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

