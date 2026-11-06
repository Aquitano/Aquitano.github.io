---
title: aqt-health
wrap:
    - aqt-
    - health
subtitle: Health Data Hub
year: '2026'
description: 'A single-user health data service in Kotlin and Ktor. It syncs Google Health and Withings over OAuth, normalizes the data into PostgreSQL with idempotent ingestion, and reconciles overlapping readings from different providers into canonical results.'
summary: 'Google Health and Withings, reconciled into one health-data API.'
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

## Problem

Google Health and Withings expose different schemas and can record the same activity. Combining their rows directly can count overlaps twice. aqt-health preserves both feeds in PostgreSQL and gives my own tools one API that reconciles them when reading.

## Preserve the provider records

Ingestion is idempotent. Each batch carries an external ID per source instance, provider record IDs skip duplicate rows where the provider supplies them, and the service stores the original provider payload next to the structured metrics for auditing and reprocessing.

## Recovery after a restart

Sync jobs run on the server, so closing the browser does not stop them. After a restart the service requeues unfinished jobs, which is safe because ingestion deduplicates by provider record ID. A job that has restarted three times fails instead of resuming, so a crash cannot loop.

## Reconcile at read time

Source priorities are applied when reading. The policy figure above shows how steps, sleep, and heart rate differ; the matrix below also covers body measurements. Filtering by provider happens before canonicalization, so original provider rows remain independently queryable.

## Implementation

The service runs on Ktor 3 with Exposed and Flyway migrations and serves an OpenAPI spec generated from its routes. CI publishes container images for the API and a Next.js frontend on every push to main.
