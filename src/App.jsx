import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
// import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/projects"    element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          {/* <Route path="/admin"       element={<Admin />} /> */}
        </Routes>
      </main>
      <Footer />
    </>
  )
}
