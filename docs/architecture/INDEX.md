# Tracker — Architecture Index

A minimal date-tracking web app. Select a date, press Done; counts accumulate per date and per month.

## Architecture at a Glance

```
Browser
  │
  └─── Next.js 15 (Vercel Edge)
         │
         ├── App Router Pages (React 19 RSC + Client Components)
         │     └── components/Calendar.tsx  (client)
         │
         └── API Routes (Vercel Serverless Functions)
               ├── POST /api/done       → upsert DoneRecord.$inc count
               └── GET  /api/records    → aggregate by year/month
                       │
                       └── MongoDB Atlas (mongoose 8.9.0)
                               └── Collection: donerecords
```

## Documents

| Document | Purpose |
|---|---|
| [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | Component design, request flows, tech stack |
| [DATA_ARCHITECTURE.md](DATA_ARCHITECTURE.md) | MongoDB schema, query patterns, indexes |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Vercel + Atlas setup, deploy checklist |
| [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md) | Input validation, secrets, threat model |

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 App Router | Vercel-native, SSR + API routes in one repo |
| Database | MongoDB Atlas | Flexible schema, easy cloud setup, free tier |
| Date storage | `YYYY-MM-DD` string | Timezone-safe, human-readable, simple to index |
| Calendar | Custom React component | No heavy lib needed for a simple month grid |
| Styling | Tailwind CSS 3.4.1 | Utility-first, no runtime overhead |

## Reading Order by Role

| Role | Start Here |
|---|---|
| New developer | This file → SYSTEM_ARCHITECTURE.md → DATA_ARCHITECTURE.md |
| DevOps / Deploy | DEPLOYMENT_GUIDE.md |
| Security review | SECURITY_ARCHITECTURE.md |
