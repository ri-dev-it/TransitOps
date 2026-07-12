# TransitOps — Smart Transport Operations Platform

Full-stack fleet operations console: vehicle registry, driver management, trip
dispatch, maintenance workflow, fuel/expense tracking, and analytics.

**Stack:** React (Vite + Tailwind) · Node.js/Express · PostgreSQL · JWT auth

---

## 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally (or a hosted instance e.g. Neon/Supabase/Railway)

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env with your PostgreSQL credentials
npm install
npm run db:init     # creates all tables
npm run db:seed      # inserts demo users + sample fleet data
npm run dev           # starts API on http://localhost:5000
```

Demo login (password for all: `Passw0rd!`):
| Role | Email |
|---|---|
| Fleet Manager | manager@transitops.com |
| Driver | driver@transitops.com |
| Safety Officer | safety@transitops.com |
| Financial Analyst | finance@transitops.com |

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev   # starts on http://localhost:5173
```

## 4. Business rules implemented

- Registration numbers and license numbers are unique (DB + API level).
- Retired / In Shop vehicles never appear in the dispatch pool (`?dispatchable=true`).
- Suspended drivers or expired licenses are excluded from dispatch pool.
- A vehicle/driver already On Trip cannot be assigned to a second trip.
- Cargo weight is validated against the vehicle's max load capacity, both client and server side.
- Dispatch → sets vehicle + driver to `On Trip`. Complete → both back to `Available` (+ odometer update + auto fuel log). Cancel → restores `Available` if it had been dispatched.
- Opening a maintenance record flips the vehicle to `In Shop`; closing it restores `Available` (unless Retired).
- Reports compute Fuel Efficiency (distance/fuel), Operational Cost (fuel + maintenance + other expenses), and ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost.
- CSV export available from the Reports page.

## 5. Project structure

```
TransitOps/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # PostgreSQL pool
│   │   ├── controllers/          # business logic per entity
│   │   ├── routes/                # Express routers
│   │   ├── middleware/auth.js     # JWT auth + RBAC
│   │   ├── db/schema.sql          # full schema
│   │   ├── db/seed.js             # demo data
│   │   └── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js           # API client w/ JWT interceptor
        ├── context/AuthContext.jsx
        ├── components/            # Navbar, ProtectedRoute, StatCard, StatusBadge
        └── pages/                 # Dashboard, Vehicles, Drivers, Trips, Maintenance, Fuel, Reports
```

## 6. Deploying quickly (hackathon-speed)

- **DB:** spin up a free PostgreSQL instance on [Neon](https://neon.tech) or [Railway](https://railway.app) — copy the connection string into `backend/.env`.
- **Backend:** deploy `backend/` to [Render](https://render.com) or Railway (Node web service, start command `npm start`, add env vars, run `npm run db:init && npm run db:seed` once via their shell).
- **Frontend:** deploy `frontend/` to [Vercel](https://vercel.com) or Netlify. Set `VITE_API_URL` to your deployed backend URL + `/api`.
- Update `CLIENT_ORIGIN` in the backend `.env` to your deployed frontend URL for CORS.

## 7. Git workflow

```bash
git init
git remote add origin https://github.com/ri-dev-it/TransitOps.git
git add .
git commit -m "TransitOps: full-stack scaffold (auth, vehicles, drivers, trips, maintenance, fuel, reports)"
git branch -M main
git push -u origin main
```

From here, commit every ~30 minutes as you build (e.g. `feat: trip dispatch lifecycle`, `feat: reports CSV export`, `fix: license expiry validation`) to show steady progress in your commit history.
