# aqt-health — Health Data Hub

**Year:** 2026  
**Scope:** Backend, API design, integrations  
**Stack:** Kotlin, Ktor, PostgreSQL, Exposed, Flyway, Next.js, Docker

Thomas Breindl built aqt-health, a single-user health data service in Kotlin and Ktor. It connects to Google Health and Withings over OAuth, encrypts their tokens at rest, and normalizes provider data into PostgreSQL through a shared ingestion batch format.

Ingestion is idempotent per source batch and deduplicates by provider record ID where the provider supplies one, and the original provider payload is kept next to the structured metrics for auditing. Sync jobs run on the server, are requeued after a restart, and fail after three restarts instead of looping. Read endpoints reconcile overlapping readings from different providers into canonical results without rewriting raw rows. The service serves an OpenAPI spec generated from its routes, and CI publishes container images for the API and a Next.js frontend.

- [Source](https://github.com/Aquitano/aqt-health)
