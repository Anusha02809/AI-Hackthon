import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import { AddressProvider } from './context/AddressContext'
import './assets/styles.css'

function App() {
  return (
    <AddressProvider>
      <div className="app-layout">
        <Header />
        <div className="main-content">
          <Sidebar />
          <Dashboard />
        </div>
        <Footer />
      </div>
    </AddressProvider>
  )
}

export default App