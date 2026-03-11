---
description: "Deploy the Tracker app to Vercel"
---
# Deployment Checklist

## Pre-deployment
1. Run lint: `npm run lint`
2. Run build locally: `npm run build`
3. Verify `.env.local` has a valid `MONGODB_URI`
4. Confirm MongoDB Atlas IP access list includes `0.0.0.0/0` (or Vercel IPs)

## Deploy
- **Automatic**: Push to `main` branch on GitHub → Vercel auto-deploys
- **Manual**: `npx vercel --prod`

## Required Vercel Environment Variable
- `MONGODB_URI` — must be set in Vercel project dashboard under Settings → Environment Variables

## Post-deployment Verification
1. Open the deployed URL
2. Navigate to a date, press Done, confirm counter increments
3. Navigate months — confirm monthly total updates correctly
4. Check Vercel function logs for any errors

See `docs/architecture/DEPLOYMENT_GUIDE.md` for full details.
