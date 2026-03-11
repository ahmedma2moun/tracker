# Data Architecture

## Data Store

| Store | Technology | Purpose | Access Pattern |
|---|---|---|---|
| donerecords | MongoDB Atlas (Mongoose 8.9.0) | Per-date done counts | Upsert by date string; find by year+month |

## Collection: `donerecords`

```
{
  _id:       ObjectId
  date:      String      // "YYYY-MM-DD" — unique
  count:     Number      // total times Done pressed for this date
  year:      Number      // e.g. 2026
  month:     Number      // 1–12  (1 = January)
  day:       Number      // 1–31
  createdAt: Date        // auto (timestamps: true)
  updatedAt: Date        // auto (timestamps: true)
}
```

### Indexes
| Index | Fields | Type | Purpose |
|---|---|---|---|
| _id_ | _id | unique | Default |
| date_1 | date | unique | Upsert lookup by exact date |
| year_1_month_1 | year, month | compound | Monthly record queries |

## Primary Query Patterns

### Mark a date as done (upsert + increment)
```javascript
DoneRecord.findOneAndUpdate(
  { date: "2026-03-11" },
  { $inc: { count: 1 }, $set: { year: 2026, month: 3, day: 11 } },
  { upsert: true, new: true }
)
```
Uses the unique `date` index. Creates a new document on first call, increments on subsequent calls.

### Fetch all records for a month
```javascript
DoneRecord.find({ year: 2026, month: 3 }).lean()
```
Uses the `{ year: 1, month: 1 }` compound index. Returns all day records for the month; `monthTotal` is computed server-side by summing `count` fields.

## Data Flow Diagram

```
Client                     API Route                   MongoDB Atlas
  │                            │                            │
  │── POST /api/done ─────────►│                            │
  │   { date: "2026-03-11" }   │── findOneAndUpdate ───────►│
  │                            │   { date }, $inc count     │
  │                            │◄── { date, count: N } ─────│
  │◄── { success, record } ────│                            │
  │                            │                            │
  │── GET /api/records ────────►│                            │
  │   ?year=2026&month=3       │── find({ year, month }) ──►│
  │                            │◄── [{ date, count }, …] ───│
  │                            │  (sum → monthTotal)        │
  │◄── { records, monthTotal } │                            │
```

## Rules

- **Never store Date objects** — always `YYYY-MM-DD` strings for `date`
- **month is 1-indexed** in the DB and API; JavaScript `Date.getMonth()` is 0-indexed
- **Always filter by year + month** to use the compound index; never scan all records
- **Use `.lean()`** on read-only queries to skip Mongoose document hydration overhead
