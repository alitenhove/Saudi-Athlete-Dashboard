# Athlete Fitness Testing Dashboard

Interactive dashboard for talent identification fitness testing events. Built with **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**-style components (Radix primitives).

## Features

- Athlete demographics and anthropometrics
- Three attempts for 30m sprint, vertical jump, and isometric mid-thigh pull with **automatic best-score calculation**
- 20m shuttle run level and shuttles achieved
- Coach observations, strengths, development areas, sport referrals, and follow-up priority
- Summary KPI cards, searchable/sortable results table, and athlete profile dialog
- **CSV export** (full dataset), **blank testing template**, and **printable** roster / individual summaries
- Five fictional sample athletes preloaded

## Run locally

```bash
cd athlete-fitness-dashboard
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Testing battery (generic labels)

| Pillar    | Test                         |
|----------|------------------------------|
| Speed    | 30m sprint                   |
| Power    | Vertical jump                |
| Strength | Isometric mid-thigh pull     |
| Endurance| 20m shuttle run (beep-style) |

No third-party sport organization branding or assets are included.

## Share via PowerPoint (hosted link)

See **[docs/HOSTING-AND-POWERPOINT.md](./docs/HOSTING-AND-POWERPOINT.md)** for:

- Deploying to **Vercel**, **Netlify**, or **Azure Static Web Apps**
- Adding a **clickable link** or **QR code** on slides
- When you need a **backend** vs hosting only
