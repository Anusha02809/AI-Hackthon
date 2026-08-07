export default function Loading() {
  return (
    <div className="card loading-spinner">
      <div className="spinner" />
      <p style={{ color: '#64748b' }}>
        Parsing address & fetching coordinates…
      </p>
    </div>
  )
}