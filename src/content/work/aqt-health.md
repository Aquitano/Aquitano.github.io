---
title: aqt-health
wrap:
    - aqt-
    - health
subtitle: Health Data Hub
year: '2026'
description: 'A single-user health data service in Kotlin and Ktor. It syncs Google Health and Withings over OAuth, normalizes the data into PostgreSQL with idempotent ingestion, and reconciles overlapping readings from different providers into canonical results.'
tags:
    - Kotlin
    - Ktor
    - PostgreSQL
    - Next.js
    - Docker
tasks:
    - Backend
    - API Design
    - Integrations
links:
    - label: GitHub
      href: https://github.com/Aquitano/aqt-health
accent: '#ff6b8b'
order: 2
---

I built aqt-health to collect my health data from Google Health and Withings into one PostgreSQL database that my own tools can read. Both providers connect over OAuth, the service encrypts their tokens at rest, and every sync normalizes the provider's response pages into a shared ingestion batch format.

Ingestion is idempotent. Each batch carries an external ID per source instance, provider record IDs skip duplicate rows where the provider supplies them, and the service stores the original provider payload next to the structured metrics for auditing and reprocessing.

Sync jobs run on the server, so closing the browser does not stop them. After a restart the service requeues unfinished jobs, which is safe because ingestion deduplicates by provider record ID. A job that has restarted three times fails instead of resuming, so a crash cannot loop.

Two devices often record the same thing. Read endpoints reconcile overlapping rows into canonical results: steps and activity prefer Google Health, body measurements and sleep prefer Withings, and when sleep sessions overlap the recording with more stages wins. Heart-rate samples from different sources within 30 seconds of each other count as one. The raw provider rows stay untouched, so ingestion output can always be audited.

The service runs on Ktor 3 with Exposed and Flyway migrations and serves an OpenAPI spec generated from its routes. CI publishes container images for the API and a Next.js frontend on every push to main.
