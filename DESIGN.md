# Portfolio design direction

## Reference study

Inspected in the browser on 6 November 2026. These references inform composition and hierarchy. Their assets and brand identities are not part of this site.

| Reference                                                                                                                     | Observed in the browser                                                                                                                                                               | Applied here                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Linear](https://linear.app/)                                                                                                 | At 1280px, a 64px Inter headline introduces the product above a large interface preview. Near-black surfaces, restrained borders, and small supporting text keep the product visible. | Put visual evidence near the introduction. Separate the headline, explanation, and supporting metadata by scale. Keep project previews unobscured. |
| [Dennis Snellenberg](https://dennissnellenberg.com/) and [his work index](https://dennissnellenberg.com/work)                 | The desktop homepage uses one photographic composition. The work index uses a large sentence-case heading and clear project names, services, and dates.                               | Give the work its own presentation. Use sentence-case headings, concise summaries, and a common metadata baseline.                                 |
| [Rauno Freiberg](https://rauno.me/), listed as an [Awwwards Honorable Mention](https://www.awwwards.com/sites/portfolio-2025) | At 1280px and 390px, a large introduction and yellow circle form one recognizable composition. Projects have distinct panels.                                                         | Keep the palette limited and each project recognizable. Do not add unrelated effects to every section.                                             |

The earlier homepage devoted a full viewport to the name, put the résumé before the work, and used six tall text cards without project images. Those choices hid the strongest evidence of design and engineering ability.

## Implementation choices

These are this portfolio's tokens, not extracted copies of the references.

| Role             | Value                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| Background       | `#0a0a0b`                                                                                           |
| Raised surface   | `#111113`                                                                                           |
| Primary text     | `#e9e9e4`                                                                                           |
| Secondary text   | `#9a9aa2`                                                                                           |
| Divider          | `#232328`                                                                                           |
| Accent           | Existing orange, `oklch(0.7165 0.1409 50.91)`                                                       |
| Headings         | Existing Archivo Variable, width 100%, weight 600, tracking -0.025em; tighter on large display type |
| Body             | Archivo Variable, regular weight, relaxed line height                                               |
| Metadata         | Geist Mono, reserved for short technical labels and section positions                               |
| Project previews | 8:5 with a 20rem minimum height, 8px corners, one subtle border                                     |

The homepage reads as introduction with a specific Cloudflare result, two current projects, a compact index of earlier projects, about and professional experience, skills, and contact. Section numbers follow that order. The desktop project grid has two entries. Earlier projects are text rows so old school-project visuals cannot dominate the current engineering work.

The hero comparison uses the existing résumé's controlled-outage retention result, 51% without compaction and 77% with compaction, in a pipeline handling 100M events/s. It is labeled as an internship experiment. Native radio controls switch a 100-cell figure between 51% and 77%; every cell represents one percentage point. The figure does not imply a sample of 100 events. The first review showed that generic introduction copy and a company-name strip buried this evidence.

Project summaries explain the outcome in one sentence. Case studies use descriptive headings to separate the problem, technical decisions, and delivery. Source-backed figures make the mechanisms and verification inspectable. Their figures add information beyond the homepage. About no longer counts years or roles. Skills are grouped into compact lines. Experience leads with one result per role and puts supporting implementation details in native disclosures. The header shares its geometry on every route; the minimap no longer reserves width on the homepage. Standalone links share a 44px minimum target height across pointer types. Hover leaves navigation white; only the current item is orange and underlined. The scrolled header is fully opaque. Navigation targets are at least 44px tall, and keyboard labels describe a next or previous stop.

## Project evidence

- The aqt homepage proof panel summarizes exact historical restore output. Its 1280×800 website capture is retained for social metadata. The case study leads with exact output from a [recorded Linux CI run](https://github.com/Aquitano/aqt-sync/actions/runs/41282154931), dated 1 November 2026 at commit 5210451. A [local text archive](public/evidence/aqt-restore-2026-11-01.txt) preserves that excerpt beyond GitHub log retention. It does not claim a new local run.
- The aqt encryption figure is based on the [documented threat model](https://github.com/Aquitano/aqt-sync/blob/31e965a9d28250ff5f29f7cb768ed5867e048dd9/docs/threat-model.md). The recovery sequence links to the [actual restore drill](https://github.com/Aquitano/aqt-sync/blob/31e965a9d28250ff5f29f7cb768ed5867e048dd9/scripts/restore-drill.sh).
- The health homepage panel and case-study selector share the same provider-track component and documented rule data. The case study has a native radio-controlled policy figure. Provider tracks visibly distinguish records kept in canonical reads from raw-only records. These are explicitly labelled schematics, not patient readings. The selector reserves space for its longest state and announces changes through a polite live region. The responsive policy matrix stacks on phones. Both use the [canonical metric documentation](https://github.com/Aquitano/aqt-health/blob/6e4f4ea48a3b7616042a1f8e16c80abc2b5838e7/README.md#canonical-metrics), which also corrected the older sleep-reconciliation description.
- FrontiersToSpace uses SVG plots built from all 429 [original filtered telemetry records](https://github.com/Aquitano/FrontiersToSpace/blob/2fb1b9a35821a83a70aa6f4bb118f472eaba2ae5/data/filtered_data.json). The local JSON preserves the numeric measurements. Positions use Unix timestamps, not equally spaced packet indices. Labels are English and time is UTC. Hourly ticks and HTML labels retain a fixed type size; non-scaling strokes retain their thickness. Mobile plots reduce intermediate labels and preserve the final recorded time. Altitude leads the page; temperature and pressure add distinct evidence below.
- Griffin uses the original Blender renders from the existing project assets. Its portfolio page does not screenshot the archive's banner or return link.
- BetterGaming uses a direct browser capture at a 1920px CSS viewport, where the original search and navigation fit. The stored capture is 1280×720. Both historical interfaces have a 928px maximum frame; no true 2× capture is claimed. ChillFlow uses a CSS crop of the supplied render, with the 2025 web-source revision linked because the repository now contains a different terminal application. Their bright mockups no longer dominate the homepage. ChillFlow's published URL returned 404 during this study; no replacement URL was guessed.

The existing fonts, palette, portfolio routes, anchor names, and analytics markers remain. The unavailable ChillFlow demo link is replaced with a pinned historical source link. Interactive behavior answers a reader's action; static architectural figures do not animate continuously.

## Validation boundaries

Reference inspection covers the stated viewports and initial compositions, not exhaustive interaction or performance audits. Check this implementation at 320px, 390px, 768px, and desktop widths, including anchor jumps, keyboard focus, image loading, and short landscape windows. The Griffin archive retains its distinct historical design.
