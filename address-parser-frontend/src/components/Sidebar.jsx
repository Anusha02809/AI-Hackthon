export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Navigation</h3>
      <ul>
        <li className="active">Dashboard</li>
        <li>History (soon)</li>
        <li>Batch Upload (soon)</li>
        <li>API Docs</li>
      </ul>

      <h3 style={{ marginTop: '2rem' }}>About</h3>
      <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
        Enter any Indian address. We clean it, extract pincode, match landmarks
        and return coordinates with confidence.
      </p>
    </aside>
  )
}