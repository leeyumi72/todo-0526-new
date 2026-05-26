export default function ProgressSection({ pct }) {
  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-label">진행률</span>
        <span className="progress-pct">{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
