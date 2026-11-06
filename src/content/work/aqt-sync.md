---
title: aqt-sync
subtitle: Encrypted File Sync
year: '2026'
description: 'Self-hosted, zero-knowledge file and folder sync written in Go. The client encrypts contents and filenames before upload, FastCDC chunking means only changed chunks are re‑sent, and tracked folders sync two‑way with snapshots and conflict handling. Git history can be pushed to an encrypted remote.'
summary: 'Encrypted files, snapshots, and Git history. One self-hosted Go binary.'
tags:
    - Go
    - SQLite
    - Cryptography
    - CLI
tasks:
    - Backend
    - CLI
    - Security
    - Infrastructure
links:
    - label: Website
      href: https://web.sync.aquitano.me
    - label: GitHub
      href: https://github.com/Aquitano/aqt-sync
accent: '#5cc8ff'
image: ../../assets/work/aqt-sync-site.webp
order: 1
---

## Problem

I wanted file and folder sync across my machines without giving my server plaintext. The same tool also had to carry encrypted Git history for my notes.

## A key hierarchy that allows passphrase changes

The passphrase unlocks a random root key rather than deriving the master key directly. Changing a passphrase rewraps one key record instead of encrypting every file again. A compromised root key requires the separate, more expensive recovery operation.

File contents and filenames are sealed on the client. The server still sees ciphertext sizes, timing, public keys, and operational metadata. The architecture diagram below makes that boundary explicit.

## Transfer only the changed chunks

FastCDC splits files into chunks, which the client seals with keyed convergent encryption and addresses in a Merkle DAG. Unchanged chunks are not resent. Tracked folders add two-way sync, snapshots, and per-folder conflict policies.

For my notes, a Git remote helper stores history as encrypted bundles behind an `aqt::` remote. Git handles history and merges; aqt seals the bundles before upload.

## Delivery and recovery

The server is one static Go binary with a SQLite data directory. Releases carry a signed manifest that `aqt update` verifies before installing. The recorded CI output above comes from a clean-server restore drill. Its recovery steps and source are documented below.
