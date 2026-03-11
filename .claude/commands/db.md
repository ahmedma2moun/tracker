---
description: "Database operations and schema reference for Tracker"
---
# Database Reference

## Collection: `donerecords`

### Schema
```
{
  date:  string   // "YYYY-MM-DD" — unique index
  count: number   // times Done was pressed for this date
  year:  number   // e.g. 2026
  month: number   // 1–12 (1=January)
  day:   number   // 1–31
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- `date` — unique (auto)
- `{ year: 1, month: 1 }` — compound (for monthly queries)

## Key Operations
- **Mark done**: `POST /api/done` with `{ "date": "YYYY-MM-DD" }` — uses `$inc` + upsert
- **Fetch month**: `GET /api/records?year=2026&month=3` — returns records + monthTotal

## Rules
- Always use `YYYY-MM-DD` string format for dates
- `month` is always 1-indexed
- Never query by date range — always filter by `{ year, month }` using the compound index
