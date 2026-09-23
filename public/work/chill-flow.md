# ChillFlow — Focus Workspace

**Year:** 2025  
**Scope:** Frontend, backend, product  
**Stack:** Next.js, TypeScript, Hono, Drizzle, PostgreSQL, Clerk, Cloudflare R2, Tailwind CSS

Thomas Breindl built ChillFlow, a focus workspace that pairs lo-fi music and an ambient sound mixer with a task list and focus and Pomodoro timers. The timers run against a wall-clock deadline, so they keep correct time in a background tab and survive a reload. A focus block can target a single task, and stats track focused minutes, completed sessions, Pomodoro cycles, and day streaks.

Cloudflare R2 serves the audio, Drizzle on Postgres holds the data behind Hono API routes, and Clerk handles authentication. Accounts can export all their data as JSON or their focus sessions as CSV.

- [Live site](https://chill-flow-roan.vercel.app)
- [Source](https://github.com/Aquitano/chill-flow)
