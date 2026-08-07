import { extractCoords } from '../utils/helpers.js'

export default function ResultCard({ result }) {
  if (!result) return null

  const coords = extractCoords(result)
  const cleaned =
    result.cleaned_address || result.formatted_address || result.address

  return (
    <div className="card">
      <div className="card-title">Cleaned Address</div>
      <p style={{ fontSize: '1.05rem', marginBottom: '1.25rem' }}>
        {cleaned || '—'}
      </p>

      <div className="result-grid">
        <div>
          <div className="card-title">Latitude</div>
          <div className="coord-value">
            {coords ? coords.lat.toFixed(6) : '—'}
          </div>
        </div>
        <div>
          <div className="card-title">Longitude</div>
          <div className="coord-value">
            {coords ? coords.lon.toFixed(6) : '—'}
          </div>
        </div>
      </div>
    </div>
  )
}