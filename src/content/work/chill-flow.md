---
title: ChillFlow
wrap:
    - Chill
    - Flow
subtitle: Focus Workspace
year: '2025'
description: 'A focus workspace that pairs lo‑fi music and an ambient sound mixer with a task list and focus and Pomodoro timers. Built with Next.js, Drizzle on Postgres, Clerk, and Cloudflare R2 for audio.'
summary: 'Lo-fi music, ambient sound, and focus timers in one workspace.'
tags:
    - Next.js
    - TypeScript
    - Drizzle
    - PostgreSQL
    - Tailwind
tasks:
    - Frontend
    - Backend
    - Product
links:
    - label: Web source (2025)
      href: https://github.com/Aquitano/chill-flow/tree/e0349881f7b9c113f49763b950c9a149634d7ad6
accent: '#4fd1c5'
image: ../../assets/work/chill-flow.webp
order: 3
---

## A focused workspace

I built ChillFlow, a focus workspace that pairs lo‑fi music and ambient sound with a task list and a timer. You start a session, mix a soundscape, and work through tasks while the timer tracks focused time.

## Audio without abrupt changes

Lo‑fi tracks come from a database-backed catalog with liked tracks per account, and switching tracks crossfades instead of cutting. An ambient mixer layers sound loops over the music and saves named mixes.

## Persistent session state

The timers run against a wall-clock deadline, so they keep correct time in a background tab and survive a reload. A focus block can target a single task, and when the block ends the app offers to check that task off. Tasks have priorities and natural-language due dates, and each one shows the focus time logged against it. Stats track focused minutes, completed sessions, full Pomodoro cycles, and day streaks.

## Implementation

The app runs on Next.js with Hono API routes, Drizzle on Postgres hosted on Neon in production, Clerk for authentication, and Cloudflare R2 for audio files. Accounts can export all their data as JSON, or their focus sessions as CSV.
