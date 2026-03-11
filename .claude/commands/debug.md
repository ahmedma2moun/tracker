---
description: "Debug an issue in the Tracker app"
---
# Debugging Protocol

## Common Issues

| Symptom | Likely Cause | Fix |
|---|---|---|
| "Failed to mark done" on Done click | `MONGODB_URI` not set | Add to `.env.local`, restart dev server |
| Calendar shows no counts after reload | MongoDB query wrong year/month params | Check `records` API params in browser DevTools Network tab |
| Count not incrementing | `findOneAndUpdate` upsert failing | Check MongoDB Atlas connection and collection permissions |
| Build fails with type errors | TypeScript strict mode violation | Run `npx tsc --noEmit` for detailed errors |
| Monthly total wrong | Month is 0-indexed in Date but 1-indexed in DB | Verify `currentMonth` is 1-indexed when passed to API |
| Vercel deploy fails | Missing env var | Add `MONGODB_URI` to Vercel project settings |

## Debug Steps
1. Check browser DevTools Console for JS errors
2. Check Network tab — look at `/api/done` and `/api/records` responses
3. Check Vercel Function Logs (for production issues)
4. Check MongoDB Atlas → Collections → DoneRecord to verify data shape
5. Run `npm run build` locally to catch build-time errors

## Log Locations
- Dev: terminal running `npm run dev`
- Production: Vercel dashboard → Project → Functions → Logs
