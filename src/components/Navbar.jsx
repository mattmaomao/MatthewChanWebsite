import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

const RESUME_URL = 'https://vcfcjoklssbqgqriyfnd.supabase.co/storage/v1/object/public/MatthewWebsite-project%20images/resume.pdf'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Smooth-scroll to a section on the home page.
  // If not on home, navigate there first then scroll.
  const scrollToSection = (sectionId) => {
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const goToPage = (path) => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
    navigate(path)
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          Matthew Chan
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            onClick={() => goToPage('/')}
          >
            Home
          </NavLink>

          <button className={styles.link} onClick={() => scrollToSection('about')}>
            About Me
          </button>

          <NavLink
            to="/projects"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            onClick={() => goToPage('/projects')}
          >
            Projects
          </NavLink>

          <a
            href={RESUME_URL}
            className={styles.link}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Resume
          </a>

          <button className={styles.link} onClick={() => scrollToSection('contact')}>
            Contact
          </button>
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
