import { Link, useNavigate } from 'react-router-dom'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project }) {
  const { slug, title, short_description, tags = [], thumbnail_url, featured } = project
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'instant' })
    navigate(`/projects/${slug}`)
  }

  return (
    <Link to={`/projects/${slug}`} className={styles.card} onClick={handleClick}>
      <div className={styles.thumbnail}>
        {thumbnail_url ? (
          <img src={thumbnail_url} alt={title} />
        ) : (
          <div className={styles.placeholder}>
            <span>{title.charAt(0)}</span>
          </div>
        )}
        {featured && <span className={styles.featuredBadge}>featured</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{short_description}</p>
        <div className={styles.tags}>
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <span className={styles.readMore}>view project →</span>
      </div>
    </Link>
  )
}
