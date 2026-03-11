# Tracker

A minimal web app to mark dates as "done" and track how many times per date and per month. Built with Next.js 15, MongoDB, and Tailwind CSS — deployed on Vercel.

## Quick Reference
- **Stack**: Next.js 15.2.0, React 19, TypeScript 5, Tailwind CSS 3.4.1, Mongoose 8.9.0
- **Architecture**: Single Next.js service with App Router API routes + MongoDB Atlas
- **Docs**: See `docs/architecture/INDEX.md` for full architecture documentation

## Build & Run
- `npm install` — Install dependencies
- `npm run dev` — Start dev server at http://localhost:3000
- `npm run build` — Build for production
- `npm run lint` — Run ESLint

## Environment
Copy `.env.local.example` to `.env.local` and set `MONGODB_URI`.

## Code Patterns
- All API routes live in `app/api/*/route.ts` (Next.js App Router)
- `lib/mongodb.ts` handles the cached Mongoose connection — always import `connectDB` and call it first in every route handler
- `models/DoneRecord.ts` is the only data model; `date` field is `YYYY-MM-DD` string, `month` is 1-indexed
- Calendar UI is a single client component at `components/Calendar.tsx` — keeps all fetch logic and state inside
- Date format throughout: `YYYY-MM-DD` strings (never Date objects across the wire)

## Architecture Quick Map
| Layer | Path | Purpose |
|---|---|---|
| UI | `app/page.tsx`, `components/Calendar.tsx` | Calendar + Done button |
| API — mark done | `app/api/done/route.ts` | POST: increment count for a date |
| API — read records | `app/api/records/route.ts` | GET: fetch records for a year/month |
| DB connection | `lib/mongodb.ts` | Cached Mongoose connection |
| Data model | `models/DoneRecord.ts` | DoneRecord schema |

## Anti-Patterns (Do NOT)
- Do not store dates as JS `Date` objects in the DB — always use `YYYY-MM-DD` strings
- Do not fetch all records and filter client-side — always pass `year` and `month` query params
- Do not duplicate the Mongoose connection logic — always use `lib/mongodb.ts`
- Do not skip `await connectDB()` at the top of API route handlers

## Deployment
- Vercel auto-deploys from the GitHub `main` branch
- Required env var in Vercel dashboard: `MONGODB_URI`
- See `docs/architecture/DEPLOYMENT_GUIDE.md` for full checklist

## Task-Specific Docs
- `docs/architecture/SYSTEM_ARCHITECTURE.md` — Component and data flow design
- `docs/architecture/DATA_ARCHITECTURE.md` — MongoDB schema and query patterns
- `docs/architecture/DEPLOYMENT_GUIDE.md` — Vercel + MongoDB Atlas setup
- `docs/architecture/SECURITY_ARCHITECTURE.md` — Input validation and secrets handling
