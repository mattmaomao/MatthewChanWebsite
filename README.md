# 🎮 Developer Portfolio

A game developer / CS graduate portfolio built with **React + Vite + Supabase**, deployed to **GitHub Pages** via **GitHub Actions**.

---

## 🗂 Project Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: auto-deploy to GitHub Pages on push
├── public/
│   └── resume.pdf              # ← drop your resume here
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .module.css
│   │   ├── Footer.jsx / .module.css
│   │   └── ProjectCard.jsx / .module.css
│   ├── pages/
│   │   ├── Home.jsx / .module.css
│   │   ├── Projects.jsx / .module.css
│   │   ├── ProjectDetail.jsx / .module.css
│   │   └── Contact.jsx / .module.css
│   ├── lib/
│   │   ├── supabase.js         # Supabase client + data helpers
│   │   └── mockData.js         # Fallback data for local dev
│   ├── App.jsx                 # Routes
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles & design tokens
├── supabase-schema.sql         # DB schema — run in Supabase SQL Editor
├── .env.example                # Env variable template
├── vite.config.js
└── package.json
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | CSS Modules |
| Backend / Database | Supabase (PostgreSQL) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Fonts | Syne + DM Mono (Google Fonts) |
