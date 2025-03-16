import type { Region } from "../../../types"
import { getScoreColorClass } from "../../../services/articleService"

interface RegionalExplorerProps {
  regions: Region[]
}

export default function RegionalExplorer({ regions }: RegionalExplorerProps) {
  return (
    <div>
      <div className="popover-header" style={{ marginBottom: "1.5rem" }}>
        <h2 className="page-title">Utforska efter landskap</h2>
        <div className="badge">Kommer snart</div>
      </div>

      <div className="region-grid">
        {regions.map((region) => (
          <div key={region.id} className="region-card">
            <div className="region-header">
              <h3 className="region-name">{region.name}</h3>
              <span className={getScoreColorClass(region.positivity)}>+{Math.round(region.positivity * 100)}%</span>
            </div>
            <p className="region-stats">{region.articles} positiva artiklar</p>
            <button className="region-button">Utforska landskap</button>
          </div>
        ))}
      </div>
    </div>
  )
}

