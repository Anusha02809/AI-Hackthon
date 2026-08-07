export default function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Address Parser · Powered by OpenStreetMap & Pincode DB
    </footer>
  )
}