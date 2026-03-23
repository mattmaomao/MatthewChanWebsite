import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProjectBySlug } from "../lib/supabase.js";
import styles from "./ProjectDetail.module.css";

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjectBySlug(slug);
        setProject(data);
      } catch {
        setProject(null);
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingDot} />
        <span className={styles.loadingDot} />
        <span className={styles.loadingDot} />
      </div>
    );
  }

  if (!project) return null;

  const {
    title,
    description,
    tags = [],
    tech_stack = [],
    thumbnail_url,
    images = [],
    github_url,
    demo_url,
  } = project;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Back */}
        <Link
          to="/projects"
          className={styles.back}
          onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
        >
          ← back to projects
        </Link>

        {/* Hero image */}
        {thumbnail_url && (
          <div className={styles.heroImg}>
            <img src={thumbnail_url} alt={title} />
          </div>
        )}

        <div className={styles.layout}>
          {/* Main content */}
          <div className={styles.main}>
            <h1 className={styles.title}>{title}</h1>

            <div className={styles.description}>
              {description.split("\n\n").map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>

            {/* Gallery */}
            {images.length > 0 && (
              <div className={styles.gallery}>
                {images.map((url, i) => (
                  <img key={i} src={url} alt={`${title} screenshot ${i + 1}`} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Links */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Links</h3>
              <div className={styles.linkList}>
                {github_url && (
                  <a
                    href={github_url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkBtn}
                  >
                    <span>⎔</span> GitHub
                  </a>
                )}
                {demo_url && (
                  <a
                    href={demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkBtnAccent}
                  >
                    <span>▶</span> Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Tech stack */}
            {tech_stack.length > 0 && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Tech Stack</h3>
                <ul className={styles.techList}>
                  {tech_stack.map((t) => (
                    <li key={t}>
                      <span className={styles.dot} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>Tags</h3>
                <div className={styles.tags}>
                  {tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
