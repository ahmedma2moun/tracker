# Deployment Guide

## CI/CD Pipeline

```
Developer pushes to main
        │
        ▼
  GitHub (main branch)
        │
        ▼
  Vercel (auto-detect Next.js)
    ├── npm install
    ├── npm run build  (next build)
    └── Deploy serverless functions + static assets
        │
        ▼
  Production URL (*.vercel.app or custom domain)
```

## First-Time Setup

### 1. MongoDB Atlas
1. Create a free cluster at cloud.mongodb.com
2. Create database: `tracker`
3. Create a DB user with readWrite on the `tracker` database
4. Whitelist IP: Add `0.0.0.0/0` (allow all) for Vercel's dynamic IPs
5. Copy the connection string: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/tracker?retryWrites=true&w=majority`

### 2. GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<user>/tracker.git
git push -u origin main
```

### 3. Vercel
1. Go to vercel.com → New Project → Import from GitHub
2. Select the `tracker` repository
3. Framework preset: **Next.js** (auto-detected)
4. Add Environment Variable:
   - Name: `MONGODB_URI`
   - Value: your Atlas connection string
5. Click **Deploy**

## Subsequent Deployments

Push to `main` → Vercel deploys automatically. No manual steps needed.

For preview deployments: push to any branch → Vercel creates a preview URL.

## Environment Variables

| Variable | Required | Where | Description |
|---|---|---|---|
| `MONGODB_URI` | Yes | Vercel + `.env.local` | MongoDB Atlas connection string |

## Rollback

In Vercel dashboard → Deployments → click any previous deployment → **Promote to Production**.

## Local Development

```bash
cp .env.local.example .env.local
# edit .env.local with your MONGODB_URI
npm install
npm run dev
# open http://localhost:3000
```

## Post-Deployment Verification Checklist

- [ ] App loads at the production URL
- [ ] Current month calendar renders correctly
- [ ] Click a date → it highlights
- [ ] Press Done → count badge appears (×1)
- [ ] Press Done again on same date → count increments (×2)
- [ ] Monthly total counter reflects total done count
- [ ] Navigate to previous/next month → counts persist
- [ ] Vercel Functions logs show no errors
