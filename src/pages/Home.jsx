import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../lib/supabase.js'
import ProjectCard from '../components/ProjectCard.jsx'
import styles from './Home.module.css'

const INFO = {
  name:     'Your Name',
  role:     'Game Developer & CS Graduate',
  tagline:  'I build games, tools, and interactive experiences. Currently looking for opportunities.',
  github:   'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  email:    'you@example.com',
  location: 'Your City',
  about: [
    'I recently graduated with a degree in Computer Science, with a focus on game development and interactive systems.',
    'I love building things — from procedurally generated game worlds to full-stack web apps. My work lives at the intersection of engineering and creativity.',
    'Outside of coding, I enjoy game jams, exploring new frameworks, and contributing to open source projects.',
  ],
  technicalSkills: [
    'Unity', 'C#', 'HLSL / Shaders',
    'React', 'Node.js', 'Supabase',
    'Python', 'Git', 'SQL',
  ],
  hobbies: [
    'Game Jams', 'Pixel Art', 'Tabletop RPGs',
    'Open Source', 'Speedrunning', 'Game Design',
  ],
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [gamejams, setGamejams] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getProjects()
        setFeatured(all.filter(p => p.featured).slice(0, 3))
        setGamejams(all.filter(p => p.gamejam).slice(0, 3))
      } catch {
        setFeatured([])
        setGamejams([])
      }
    }
    load()
  }, [])

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section id="home" className={styles.hero}>
        <div className="container">
          <p className={styles.greeting}>Hi, I'm</p>
          <h1 className={styles.name}>{INFO.name}</h1>
          <h2 className={styles.role}>{INFO.role}</h2>
          <p className={styles.tagline}>{INFO.tagline}</p>
          <div className={styles.socials}>
            <a href={INFO.github}   target="_blank" rel="noreferrer">GitHub</a>
            <a href={INFO.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className={styles.aboutSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>About Me</h2>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              {INFO.about.map((para, i) => <p key={i}>{para}</p>)}
            </div>
            <div className={styles.skillsGrid}>
              <div>
                <p className={styles.skillGroupTitle}>Technical Skills</p>
                <div className={styles.skills}>
                  {INFO.technicalSkills.map((s, i) => (
                    <span key={s} className={styles.skill} style={{ animationDelay: `${i * 50}ms` }}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className={styles.skillGroupTitle}>Hobbies</p>
                <div className={styles.skills}>
                  {INFO.hobbies.map((s, i) => (
                    <span key={s} className={styles.skill} style={{ animationDelay: `${i * 50}ms` }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      {featured.length > 0 && (
        <section className={styles.featuredSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured Projects</h2>
              <Link to="/projects" className={styles.seeAll}
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
                See All →
              </Link>
            </div>
            <div className={styles.grid}>
              {featured.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Game Jam ── */}
      {gamejams.length > 0 && (
        <section className={styles.featuredSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleRow}>
                <h2 className={styles.sectionTitle}>Game Jam Entries</h2>
                <span className={styles.jamBadge}>48h</span>
              </div>
              <Link to="/projects" className={styles.seeAll}
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
                See All →
              </Link>
            </div>
            <div className={styles.grid}>
              {gamejams.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ── */}
      <section id="contact" className={styles.contactSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <div className={styles.contactGrid}>
            <div>
              <p className={styles.contactDesc}>
                Whether it's a job opportunity, a collaboration, or just saying hi — feel free to reach out. I'm currently open to full-time roles in game development or software engineering.
              </p>
              <div className={styles.contactLinks}>
                <div className={styles.contactLink}>
                  <span className={styles.contactLinkLabel}>Email</span>
                  <a href={`mailto:${INFO.email}`}>{INFO.email}</a>
                </div>
                <div className={styles.contactLink}>
                  <span className={styles.contactLinkLabel}>GitHub</span>
                  <a href={INFO.github} target="_blank" rel="noreferrer">{INFO.github.replace('https://', '')}</a>
                </div>
                <div className={styles.contactLink}>
                  <span className={styles.contactLinkLabel}>LinkedIn</span>
                  <a href={INFO.linkedin} target="_blank" rel="noreferrer">{INFO.linkedin.replace('https://', '')}</a>
                </div>
              </div>
            </div>
            <div className={styles.availabilityCard}>
              <p className={styles.availabilityTitle}>Currently</p>
              <p className={styles.availabilityText}>
                Open to full-time roles in <strong>game development</strong> or <strong>software engineering</strong>. Based in <strong>{INFO.location}</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
