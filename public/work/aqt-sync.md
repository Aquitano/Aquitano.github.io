# aqt-sync — Encrypted File Sync

**Year:** 2026  
**Scope:** Backend, CLI, security, infrastructure  
**Stack:** Go, SQLite, XChaCha20-Poly1305, Argon2id

Thomas Breindl built aqt-sync, a self-hosted, zero-knowledge file and folder sync system in Go. The client encrypts file contents and filenames with XChaCha20-Poly1305 before upload. The server stores ciphertext, public keys, and wrapped key records, never a passphrase or a plaintext key.

The client splits files into chunks with FastCDC, seals them with keyed convergent encryption, and addresses them in a Merkle DAG, so unchanged chunks are not re-sent and a file that appears in several folders is stored once. Tracked folders sync two-way with snapshots, named checkpoints, and a per-folder conflict policy. A Git remote helper stores repository history as encrypted bundles behind an `aqt::` remote, which is how he backs up his personal notes.

The server is one static Go binary with a SQLite data directory. `aqt update` verifies a signed release manifest before installing, and an automated restore drill recovers from a server backup on a clean client profile and compares the restored files byte for byte.

- [Website](https://web.sync.aquitano.me)
- [Source](https://github.com/Aquitano/aqt-sync)
