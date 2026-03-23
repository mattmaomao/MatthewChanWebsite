import { useEffect, useState } from "react";
import { getProjects } from "../lib/supabase.js";
import ProjectCard from "../components/ProjectCard.jsx";
import styles from "./Projects.module.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTag, setActiveTag] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setFiltered(data);
      } catch {
        setProjects([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Collect unique tags across all projects
  const allTags = [
    ...new Set(["all", "featured", "game", ...projects.flatMap((p) => p.tags || []).map((t) => t.toLowerCase()).sort()]),
  ];

  const filterByTag = (tag) => {
    setActiveTag(tag);
    setFiltered(
      tag === "all"
        ? projects
        : tag === "featured"
          ? projects.filter((p) => p.featured)
          : projects.filter((p) => p.tags?.map?.((t) => t.toLowerCase())?.includes(tag)),
    );
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            A collection of games, tools, and experiments.
          </p>
        </div>

        {/* Tag filter */}
        <div className={styles.filters}>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.filterBtn} ${activeTag === tag ? styles.active : ""}`}
              onClick={() => filterByTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}>
            <span className={styles.loadingDot} />
            <span className={styles.loadingDot} />
            <span className={styles.loadingDot} />
          </div>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No projects found.</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
