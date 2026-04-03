---
description: Deploy the LogiFlow AI frontend to Vercel
---

# Deploy to Vercel Workflow

Deploys the Next.js frontend to Vercel. Always deploy as **preview** unless the user explicitly asks for production.

Refer to the `deploy-to-vercel` skill at `.agents/skills/deploy-to-vercel/SKILL.md` for the full decision tree.

## Step 1: Gather Project State

Run all checks to determine which deploy method to use:

```bash
# Check for git remote
git remote get-url origin

# Check if linked to Vercel
type .vercel\project.json 2>nul || type .vercel\repo.json 2>nul

# Check Vercel CLI auth
vercel whoami

# List teams
vercel teams list --format json
```

## Step 2: Ensure Environment Variables Are Set on Vercel

Before deploying, confirm these are set in the Vercel dashboard or via CLI:

```bash
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_WS_URL
vercel env add NEXTAUTH_SECRET
```

## Step 3: Choose Deploy Method

Follow the decision logic from the `deploy-to-vercel` skill:

| State                              | Method                        |
|------------------------------------|-------------------------------|
| Linked + git remote exists         | `git add . && git commit && git push` |
| Linked + no git remote             | `vercel deploy -y --no-wait`  |
| Not linked + CLI authenticated     | Link first, then deploy       |
| Not linked + CLI not authenticated | Install CLI, login, link, deploy |

## Step 4: Deploy (preview by default)

```bash
# Preview deploy (default)
vercel deploy -y --no-wait

# Production deploy (only if explicitly requested)
vercel deploy --prod -y --no-wait
```

## Step 5: Verify Deployment

```bash
vercel inspect <deployment-url>
```

Share the preview URL with the team. Do **not** curl the URL to verify.

---

## Notes
- The frontend targets Vercel; the backend deploys separately to Railway/Fly.io.
- Never commit `.env.local` — all secrets go through Vercel environment variable settings.
- Check build output in the Vercel dashboard for SSR/hydration errors after deploy.
