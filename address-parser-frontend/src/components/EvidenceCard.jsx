export default function EvidenceCard({ evidence }) {
  if (!evidence || (Array.isArray(evidence) && evidence.length === 0)) {
    return null
  }

  const items = Array.isArray(evidence)
    ? evidence
    : Object.entries(evidence).map(([key, value]) => ({ key, value }))

  return (
    <div className="card">
      <div className="card-title">Evidence</div>
      <ul className="evidence-list">
        {items.map((item, idx) => {
          const label = item.key || item.type || item.label || `Item ${idx + 1}`
          const value =
            item.value ?? item.text ?? item.name ?? JSON.stringify(item)
          return (
            <li key={idx}>
              <span className="evidence-label">{label}</span>
              <span className="evidence-value">{String(value)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}