---
title: ChillFlow
wrap:
    - Chill
    - Flow
subtitle: Terminal Focus Player
year: '2026'
description: 'A terminal player for focused work, written in Rust. It plays lo‑fi from a hosted catalog or from YouTube, layers ambient sound underneath, and runs a focus timer that tracks the time actually spent focusing. It ships as one binary for macOS and Windows.'
tags:
    - Rust
    - Ratatui
    - SQLite
    - Cloudflare Workers
    - Cloudflare R2
tasks:
    - CLI
    - Audio
    - Product
links:
    - label: GitHub
      href: https://github.com/Aquitano/chill-flow
accent: '#4fd1c5'
image: ../../assets/work/chill-flow.webp
order: 3
---

I built ChillFlow as a terminal player for focused work. It plays lo‑fi from a hosted catalog or from YouTube, layers ambient sound underneath, and runs a focus timer. It is written in Rust with Ratatui and ships as a single `chill` binary for macOS and Windows, with installers and an in-place `chill update`.

Music and ambience are separate layers with a balance slider between them, so a loud stream can sit under quiet rain without touching the volume. White, pink, and brown noise are generated in the app and play offline. A scene saves the source, ambience, balance, and timer together, and `chill "rainy study"` loads one by name.

The timer counts every minute a focus block ran, including blocks stopped early, and never counts breaks. The header shows today's total and a seven-day sparkline.

Everything lives in a local SQLite database, so the app works offline. Optional sync carries the library, likes, scenes, mixes, focus history, and settings between machines through a Cloudflare Worker. A sync space has no account: one key opens it, and when the same item changed on two machines, the later change wins.

The catalog is a JSON file that lists tracks stored in Cloudflare R2. A companion tool normalizes new audio to a fixed loudness, uploads it, and updates the catalog. The app keeps the last copy it fetched for offline starts and falls back to the copy compiled into the binary.

The first version of ChillFlow was a Next.js web app. This one replaces it.
