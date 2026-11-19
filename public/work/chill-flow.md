# ChillFlow — Terminal Focus Player

**Year:** 2026  
**Scope:** CLI, audio, product  
**Stack:** Rust, Ratatui, SQLite, Cloudflare Workers, Cloudflare R2

Thomas Breindl built ChillFlow, a terminal player for focused work written in Rust with Ratatui. It plays lo-fi from a hosted catalog or from YouTube, layers ambient sound underneath, and runs a focus timer. The timer counts every minute a focus block ran, including blocks stopped early, and never counts breaks. It ships as a single `chill` binary for macOS and Windows.

Everything lives in a local SQLite database, so the app works offline. Optional sync carries the library, likes, scenes, mixes, focus history, and settings between machines through a Cloudflare Worker, with one key per sync space and no account. The catalog is a JSON file that lists tracks stored in Cloudflare R2, and a companion tool normalizes and uploads new audio.

The first version of ChillFlow was a Next.js web app, which this one replaces.

- [Source](https://github.com/Aquitano/chill-flow)
