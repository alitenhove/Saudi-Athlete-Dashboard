# Host the dashboard and link it from PowerPoint

## Fastest path: GitHub Pages (free link)

Use this if you have (or can create) a **GitHub** account. The repo includes a workflow that builds and hosts the app for you.

1. Create a new repository on [github.com](https://github.com/new) (e.g. `athlete-fitness-dashboard`).
2. Upload this project folder to that repo (GitHub Desktop, `git push`, or **Add file → Upload files** in the browser).
3. In the repo: **Settings → Pages → Build and deployment → Source** → choose **GitHub Actions**.
4. Push any commit to the `main` branch (or run the **Deploy to GitHub Pages** workflow manually under **Actions**).
5. After the workflow succeeds, open **Settings → Pages** again. Your link will look like:
   - `https://<your-username>.github.io/<repo-name>/`

Use that URL in PowerPoint (**Insert → Link**).

---

## Two ideas, in plain language

| What people often say | What it really means for this project |
|----------------------|----------------------------------------|
| **“Put it online” / hosting** | Build the app and publish it so anyone gets a normal **https://…** link. |
| **“Backend”** | A **server + database** so every coach sees the **same** athlete list and edits sync. |

For a **PowerPoint demo link**, you only need **hosting** (first row). The app already runs entirely in the browser; each visitor gets their own session unless you add a backend later.

If your organization needs **one shared event roster** for all staff, say so—we can add something like **Supabase** or **Azure** next.

---

## Recommended: Vercel (free, ~10 minutes)

Good default: connect GitHub, automatic deploys on every push.

1. Install [Node.js LTS](https://nodejs.org/) on your PC if you have not already.
2. Put the project on **GitHub** (new repo → upload `athlete-fitness-dashboard` folder).
3. Sign up at [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
4. Vercel should detect **Vite** automatically:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. Click **Deploy**. You will get a URL like `https://athlete-fitness-dashboard.vercel.app`.

This repo includes `vercel.json` so client-side routes work if you add more pages later.

### Custom link (optional)

In Vercel → Project → **Settings → Domains**, add a subdomain your org owns (e.g. `testing.yourorg.ca`).

---

## Alternative: Netlify

1. Same GitHub repo as above.
2. [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**.
3. Netlify reads `netlify.toml` in this repo (build + SPA redirects).
4. Deploy → URL like `https://something.netlify.app`.

---

## Alternative: Azure Static Web Apps (common in sport / gov)

1. GitHub repo for this project.
2. Azure Portal → **Create Static Web App** → connect repo.
3. Build settings:
   - App location: `/`
   - Output location: `dist`
   - Build command: `npm run build`
4. `staticwebapp.config.json` in this repo handles SPA routing.

Use this if IT requires everything in **Azure**.

---

## Add the link to PowerPoint

### Option A — Clickable link (best for live presenting)

1. Open your slide in PowerPoint.
2. Add a text box, e.g. **Open live dashboard →**
3. Select the text → **Insert** → **Link** (or Ctrl+K).
4. Paste your hosted URL (`https://…`).
5. In **Slide Show**, **Ctrl+click** the link to open the dashboard in the browser.

Tip: Put the full URL on the slide as well so people can type it or photograph it.

### Option B — QR code (best for handouts / room posters)

1. Use any QR generator (built into PowerPoint on some versions, or a site your IT allows).
2. Point the QR at the same **https** URL.
3. Place the QR on a title or appendix slide.

### What not to expect

Embedding the site *inside* a PowerPoint slide as a live web frame is unreliable offline and in many corporate networks. A **hyperlink or QR code** is the standard approach.

---

## Before you present

1. Open the hosted URL on the presentation machine (or phone) once to confirm it loads.
2. Decide whether to mention: *“Sample data is for demo; export CSV for your records.”*
3. If the room has strict Wi‑Fi, test the link on guest Wi‑Fi beforehand.

---

## Quick local check before deploying

```bash
cd athlete-fitness-dashboard
npm install
npm run build
npm run preview
```

If preview works at `http://localhost:4173`, the hosted build should behave the same.

---

## Next step: real backend (optional)

Choose this if multiple coaches must **share one event database** (not separate browser sessions).

| Approach | Best for |
|----------|----------|
| **Supabase** | Fast setup, auth + Postgres, free tier |
| **Azure Static Web Apps + Azure Functions + Cosmos/SQL** | Org already on Microsoft stack |
| **Custom API** | Full control, more build time |

We have not wired a backend yet; exports (CSV) are the shared handoff today. Request backend work when you know which platform IT prefers.
