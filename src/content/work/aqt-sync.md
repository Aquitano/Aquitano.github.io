---
title: aqt-sync
subtitle: Encrypted File Sync
year: '2026'
description: 'Self-hosted, zero-knowledge file and folder sync written in Go. The client encrypts contents and filenames before upload, FastCDC chunking means only changed chunks are re-sent, and tracked folders sync two-way with snapshots and conflict handling. Git history can be pushed to an encrypted remote.'
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
image: ../../assets/work/aqt-sync.webp
order: 1
---

I built aqt to sync files and folders between my machines through a server I run myself. The client encrypts file contents and filenames with XChaCha20-Poly1305 before upload. Argon2id turns the passphrase into a key that wraps a random root key. The server stores ciphertext, public keys, wrapped key records, and operational metadata such as sizes and timestamps. It never receives the passphrase or a plaintext decryption key.

The client splits files into chunks with FastCDC, seals them with keyed convergent encryption, and addresses them in a Merkle DAG. Unchanged chunks are never re-sent, and a file that appears in several folders is stored once.

Tracked folders sync two-way with snapshots and named checkpoints, and a per-folder conflict policy decides whether a conflict blocks the sync, keeps a copy, or merges. A Git remote helper stores repository history as encrypted bundles behind an `aqt::` remote. That is how I back up my personal notes: Git handles history and merges, and aqt encrypts the bundles before they reach my server.

The server is one static Go binary with a SQLite data directory. Releases ship with a signed manifest that `aqt update` verifies before installing. A restore drill tests recovery end to end: it backs up a test server, starts a fresh server from the copy, restores on a clean client profile from only an email and a passphrase, and compares the restored files byte for byte.
