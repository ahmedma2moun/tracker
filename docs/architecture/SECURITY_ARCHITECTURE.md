# Security Architecture

## Security Layers

```
Internet
    │
    ▼
Vercel Edge (HTTPS enforced, DDoS protection)
    │
    ▼
Next.js API Routes
    ├── Input validation (date format regex)
    ├── Type coercion for year/month params
    └── No authentication (public app)
    │
    ▼
MongoDB Atlas
    ├── DB user with readWrite scope (not admin)
    └── Network: 0.0.0.0/0 (open — required for Vercel)
```

## Threat Model (STRIDE — relevant entries)

| Threat | Vector | Mitigation |
|---|---|---|
| Injection | Malformed `date` in POST body | Regex validation `/^\d{4}-\d{2}-\d{2}$/` before DB operation |
| Injection | Invalid `year`/`month` query params | `parseInt()` + range check (month 1–12) |
| Spoofing | No auth (intentional for MVP) | App is public read/write; no sensitive data |
| Info Disclosure | MongoDB URI in code | Loaded from env var only; never committed |
| DoS | Excessive Done clicks | No rate limiting currently (acceptable for low-traffic MVP) |

## Secrets Architecture

| Secret | Storage | Injection |
|---|---|---|
| `MONGODB_URI` | Vercel Environment Variables | Injected at build/runtime as `process.env.MONGODB_URI` |
| `MONGODB_URI` (local) | `.env.local` (git-ignored) | Read by Next.js dev server |

**Never commit `.env.local` or any file containing the real connection string.**

## Input Validation

### POST /api/done
```typescript
// Date must match YYYY-MM-DD exactly
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  return 400
}
```

### GET /api/records
```typescript
// year and month must be valid integers; month in 1–12
if (!year || !month || month < 1 || month > 12) {
  return 400
}
```

## Current Limitations (acceptable for MVP)
- No authentication — the app is fully public
- No rate limiting on the Done endpoint
- MongoDB Atlas IP allowlist is open (`0.0.0.0/0`) — required for Vercel serverless IPs
- No CSRF protection — API is same-origin only and stateless
