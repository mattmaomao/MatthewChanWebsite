import { useEffect, useState } from 'react'
import { getProjects } from '../lib/supabase.js'
import ProjectCard from '../components/ProjectCard.jsx'
import styles from './Projects.module.css'

const ALL = 'all'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)

  // One active filter per category; null means "all" for that category
  const [filters, setFilters] = useState({
    platform: ALL,
    engine:   ALL,
    genre:    ALL,
  })

  useEffect(() => {
    const load = async () => {
      try {
        setProjects(await getProjects())
      } catch {
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Collect unique values per category from all projects
  const options = {
    platform: [ALL, ...new Set(projects.flatMap(p => p.platforms ?? []))],
    engine:   [ALL, ...new Set(projects.flatMap(p => p.engines   ?? []))],
    genre:    [ALL, ...new Set(projects.flatMap(p => p.genres    ?? []))],
  }

  const setFilter = (category, value) =>
    setFilters(prev => ({ ...prev, [category]: value }))

  const filtered = projects
    .filter(p => {
      if (filters.platform !== ALL && !(p.platforms ?? []).includes(filters.platform)) return false
      if (filters.engine   !== ALL && !(p.engines   ?? []).includes(filters.engine))   return false
      if (filters.genre    !== ALL && !(p.genres    ?? []).includes(filters.genre))     return false
      return true
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

  const activeCount = Object.values(filters).filter(v => v !== ALL).length

  const clearAll = () => setFilters({ platform: ALL, engine: ALL, genre: ALL })

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>A collection of games, tools, and experiments.</p>
        </div>

        {/* ── Filter bar ── */}
        <div className={styles.filterBar}>
          <FilterGroup
            label="Platform"
            options={options.platform}
            active={filters.platform}
            onChange={v => setFilter('platform', v)}
          />
          <FilterGroup
            label="Engine"
            options={options.engine}
            active={filters.engine}
            onChange={v => setFilter('engine', v)}
          />
          <FilterGroup
            label="Genre"
            options={options.genre}
            active={filters.genre}
            onChange={v => setFilter('genre', v)}
          />
          {activeCount > 0 && (
            <button className={styles.clearBtn} onClick={clearAll}>
              Clear filters ({activeCount})
            </button>
          )}
        </div>

        {/* ── Results ── */}
        {loading ? (
          <div className={styles.loading}>
            <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
          </div>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No projects match the selected filters.</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterGroup({ label, options, active, onChange }) {
  // Don't render a group that only has "all"
  if (options.length <= 1) return null

  return (
    <div className={styles.filterGroup}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.filterOptions}>
        {options.map(opt => (
          <button
            key={opt}
            className={`${styles.filterBtn} ${active === opt ? styles.filterBtnActive : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt === ALL ? 'All' : opt}
          </button>
        ))}
      </div>
    </div>
  )
}
