import { formatConfidence, getConfidenceColor } from '../utils/helpers.js'

export default function ConfidenceBar({ score }) {
  const percent = formatConfidence(score)
  const color = getConfidenceColor(percent)

  return (
    <div className="card">
      <div className="card-title">Confidence Score</div>
      <div className="confidence-container">
        <div className="confidence-track">
          <div
            className="confidence-fill"
            style={{ width: `${percent}%`, background: color }}
          />
        </div>
        <div className="confidence-label">
          <span>{percent}%</span>
          <span>
            {percent >= 80 ? 'High' : percent >= 55 ? 'Medium' : 'Low'}
          </span>
        </div>
      </div>
    </div>
  )
}