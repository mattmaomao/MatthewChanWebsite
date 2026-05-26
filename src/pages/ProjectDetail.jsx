import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProjectBySlug } from "../lib/firebase.js";
import styles from "./ProjectDetail.module.css";

// ── Minimal markdown renderer (no external dependency) ────────────────────────
function Markdown({ content }) {
  if (!content) return null;

  // Process line by line for accurate rendering
  const lines = content.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i}>{inlineFormat(line.slice(4))}</h3>);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i}>{inlineFormat(line.slice(3))}</h2>);
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(<h1 key={i}>{inlineFormat(line.slice(2))}</h1>);
      i++;
      continue;
    }

    // Unordered list — collect consecutive list items
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        items.push(<li key={i}>{inlineFormat(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={i}>{inlineFormat(lines[i].replace(/^\d+\.\s/, ""))}</li>,
        );
        i++;
      }
      elements.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    }

    // Horizontal rule
    if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      elements.push(<hr key={i} />);
      i++;
      continue;
    }

    // Blank line — skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("* ") &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      elements.push(<p key={`p-${i}`}>{inlineFormat(paraLines.join(" "))}</p>);
    }
  }

  return <div className={styles.markdown}>{elements}</div>;
}

// Inline formatting: bold, italic, inline code
function inlineFormat(text) {
  const parts = [];
  // Split on bold (**text**), italic (*text*), and code (`text`)
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));

    if (match[0].startsWith("**"))
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    else if (match[0].startsWith("*"))
      parts.push(<em key={match.index}>{match[3]}</em>);
    else if (match[0].startsWith("`"))
      parts.push(<code key={match.index}>{match[4]}</code>);

    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

// ── Tag group component ───────────────────────────────────────────────────────
function TagGroup({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={styles.tagGroup}>
      <p className={styles.tagGroupLabel}>{label}</p>
      <div className={styles.tagList}>
        {items.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
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
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    );
  }

  if (!project) return null;

  const {
    title,
    description,
    platforms = [],
    engines = [],
    genres = [],
    tech_stack = [],
    thumbnail_url,
    images = [],
    links = [],
  } = project;

  return (
    <div className={styles.page}>
      <div className="container">
        <Link
          to="/projects"
          className={styles.back}
          onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
        >
          ← back to projects
        </Link>

        {thumbnail_url && (
          <div className={styles.heroImg}>
            <img src={thumbnail_url} alt={title} />
          </div>
        )}

        <div className={styles.layout}>
          {/* ── Main content ── */}
          <div className={styles.main}>
            <h1 className={styles.title}>{title}</h1>
            <Markdown content={description} />

            {images.length > 0 && (
              <div className={styles.gallery}>
                {images.map((url, i) => (
                  <img key={i} src={url} alt={`${title} screenshot ${i + 1}`} />
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className={styles.sidebar}>
            {/* Links */}
            {links.length > 0 && (
              <div className={styles.sideCard}>
                <p className={styles.sideTitle}>Links</p>
                <div className={styles.linkList}>
                  {links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.linkBtn}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Tag groups */}
            {(platforms.length > 0 ||
              engines.length > 0 ||
              genres.length > 0 ||
              tech_stack.length > 0) && (
              <div className={styles.sideCard}>
                <p className={styles.sideTitle}>Details</p>
                <div className={styles.tagGroups}>
                  <TagGroup label="Platform" items={platforms} />
                  <TagGroup label="Game Engine" items={engines} />
                  <TagGroup label="Genre" items={genres} />
                  <TagGroup label="Tech" items={tech_stack} />
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
