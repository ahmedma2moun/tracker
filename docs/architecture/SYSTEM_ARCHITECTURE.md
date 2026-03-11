# System Architecture

## Executive Summary

Tracker is a single-service Next.js 15 web application. Users select calendar dates and press "Done" to increment a counter per date. Each date can be marked done multiple times. A monthly total aggregates all done counts for the displayed month. The app is deployed on Vercel with MongoDB Atlas as the data store.

## Component Diagram (C4 Level 2)

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│                                                     │
│   app/page.tsx (React Server Component)             │
│     └── components/Calendar.tsx (Client Component)  │
│           ├── State: currentYear, currentMonth,     │
│           │         selectedDate, records           │
│           ├── Renders: month grid, day cells,       │
│           │            monthly total, Done button   │
│           └── Calls: /api/done, /api/records        │
└───────────┬─────────────────────────────────────────┘
            │ HTTP/HTTPS
┌───────────▼─────────────────────────────────────────┐
│          Vercel Serverless Functions                │
│                                                     │
│  POST /api/done                                     │
│    └── Validates date format (YYYY-MM-DD)           │
│    └── connectDB() → DoneRecord.findOneAndUpdate    │
│         { $inc: { count: 1 }, upsert: true }        │
│                                                     │
│  GET /api/records?year=YYYY&month=MM                │
│    └── Validates year/month params                  │
│    └── connectDB() → DoneRecord.find({ year, month })│
│    └── Returns records[] + monthTotal               │
└───────────┬─────────────────────────────────────────┘
            │ Mongoose 8.9.0 (connection cached per fn)
┌───────────▼─────────────────────────────────────────┐
│              MongoDB Atlas                          │
│   Database: tracker                                 │
│   Collection: donerecords                           │
│   Indexes: date (unique), { year, month } compound  │
└─────────────────────────────────────────────────────┘
```

## Primary Request Flow — Mark a Date as Done

```
1. User clicks a day cell        → Calendar sets selectedDate
2. User clicks "Done" button     → handleDone() called
3. fetch POST /api/done          → { date: "2026-03-11" }
4. Route validates date regex    → /^\d{4}-\d{2}-\d{2}$/
5. connectDB()                   → reuses cached Mongoose connection
6. findOneAndUpdate (upsert)     → $inc count, returns updated doc
7. fetchRecords() called         → GET /api/records?year=2026&month=3
8. Calendar re-renders           → updated count badge + monthTotal
```

## Technology Stack

| Component | Package | Version | Purpose |
|---|---|---|---|
| Framework | next | 15.2.0 | Full-stack React (SSR + API routes) |
| UI | react, react-dom | 19.0.0 | Client rendering |
| Language | typescript | 5.x | Static typing |
| Styling | tailwindcss | 3.4.1 | Utility CSS, no runtime |
| ORM | mongoose | 8.9.0 | MongoDB schema + connection |
| Runtime | Node.js | 20.x (Vercel) | Serverless function runtime |

## Cross-Cutting Concerns

**Mongoose Connection Caching**
`lib/mongodb.ts` uses a module-level `global.mongoose` cache to reuse the connection across hot-reloaded serverless function invocations. Every API route must call `await connectDB()` before any DB operation.

**Date Convention**
All dates are stored and transmitted as `YYYY-MM-DD` strings. The `month` field in the DB is 1-indexed (1=January). JavaScript's `Date.getMonth()` returns 0-indexed — the Calendar component adds 1 before sending to the API.

**Error Handling**
API routes return `{ success: false, error: string }` with appropriate HTTP status codes. The Calendar component silently suppresses fetch errors for MVP simplicity.
