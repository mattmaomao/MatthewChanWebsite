import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.text}>
          Built with React + Vite + Supabase
        </span>
        <span className={styles.text}>
          &copy; Matthew Chan 2026
        </span>
      </div>
    </footer>
  )
}
