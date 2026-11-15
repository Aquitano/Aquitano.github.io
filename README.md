# Aquitano.github.io

<p align="center">
  <h3 align="center">Readme of Portfolio</h3>
  <p align="center">✨My <a href="https://thomasbreindl.me/?utm_source=github&utm_medium=readme">portfolio website</a>. Built with Astro, TailwindCSS &amp; TypeScript, with GSAP-powered animations and a dot-matrix hero. Hosted on Vercel. ✨</p>
</p>

<p>
  <h3 align="center">Technologies</h3>
    <li>TypeScript</li>
    <li>Astro</li>
    <li>TailwindCSS</li>
    <li>GSAP</li>
  </p>
</p>

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command          | Action                                       |
| :--------------- | :------------------------------------------- |
| `bun install`    | Installs dependencies                        |
| `bun dev`        | Starts local dev server at `localhost:4321`  |
| `bun run build`  | Build your production site to `./dist/`      |
| `bun run check`  | Type-checks, lints, checks formatting, tests |
| `bun run format` | Formats with oxfmt                           |

## Project evidence

Where each capture, run and dataset on the case studies and project cards came from.

- **aqt-sync.** The banner is the aqt website, captured live on 7 November 2026. The restore record quotes [CI run 41282154931](https://github.com/Aquitano/aqt-sync/actions/runs/41282154931) at commit `5210451`, created 1 November 2026 and retrieved 6 November 2026. [`public/evidence/aqt-restore-2026-11-01.txt`](public/evidence/aqt-restore-2026-11-01.txt) keeps that excerpt after GitHub's log retention ends. It is not a new local run. The encryption figure follows the [threat model](https://github.com/Aquitano/aqt-sync/blob/31e965a9d28250ff5f29f7cb768ed5867e048dd9/docs/threat-model.md), and the recovery steps link to the [restore drill script](https://github.com/Aquitano/aqt-sync/blob/31e965a9d28250ff5f29f7cb768ed5867e048dd9/scripts/restore-drill.sh).
- **aqt-health.** The reconciliation figure uses schematic records, labelled as not real health data. Its rules in `src/lib/reconciliation.ts` follow the [canonical metrics in the project README](https://github.com/Aquitano/aqt-health/blob/6e4f4ea48a3b7616042a1f8e16c80abc2b5838e7/README.md#canonical-metrics).
- **FrontiersToSpace.** The banner plots the mission's 429 recorded positions over OpenStreetMap, credited in its caption, because the live dashboard can no longer show the route. The plots read `src/data/flight.json`, the 429 [filtered telemetry records](https://github.com/Aquitano/FrontiersToSpace/blob/2fb1b9a35821a83a70aa6f4bb118f472eaba2ae5/data/filtered_data.json) from the 8 July 2023 flight, with times in UTC.
- **ChillFlow.** The hosted demo is offline, so the banner is a 3x capture of the landing page from commit [`7e853cf`](https://github.com/Aquitano/chill-flow/tree/7e853cf), run locally. The source link points at the same commit.
- **BetterGaming.** The banner is a capture of the live demo, searching for "Assassin" and sorted by price.
- **Griffin Energy.** The banner is a Blender render and photo composite from the original 2020 site.
- **Card art.** Each card draws a small source image from `src/assets/pixel/` on its LED grid. The FrontiersToSpace card shows the recorded flight profile.
