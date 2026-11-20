# 🎓 VeriMark — Tamper-Proof Exam Result Ledger (Code Fuzion 2026 - H8)

A cryptographically secure, append-only result publishing and verification system designed for universities. VeriMark ensures that student marks cannot be tampered with after publication, provides instantaneous public QR-based verification, enforces dual-key governance for legitimate grade amendments, and continuously monitors the database to pinpoint any direct SQL manipulation.

---

## 🎯 Problem Statement (H8)
Marks get changed after publication, and students cannot prove what their original result said. 
**VeriMark** solves this by:
1. **Merkle Tree & Cryptographic Hash-Chain Ledger:** Every published result is deterministically hashed into a cryptographic Merkle tree. A student's single result can be verified publicly with an $O(\log N)$ inclusion proof without revealing other students' marks.
2. **Dual-Key Cryptographic Corrections:** No single administrator or database operator can silently modify marks. Corrections require independent digital signatures (Ed25519) from two authorized officials (e.g., Dean and Controller of Examinations) along with an audit justification.
3. **Marksheet QR Code Verification:** Printed marksheet QR codes carry verifiable cryptographic proof payloads that can be scanned and verified offline or online against the published ledger root.
4. **Real-Time Direct DB Tamper Detection Daemon:** Continuously audits database records against the immutable ledger root. If an unauthorized actor executes direct SQL mutations (e.g. `UPDATE results SET marks = 99`), the daemon flags the violation in real time, pinpointing the exact student record, row, and altered fields.

---

## 🏗️ Architecture Overview

```
                                [ Registrar / Admin Portal ]
                                            │
                                  (Bulk CSV / Result Ingestion)
                                            │
                                            ▼
                           [ Canonical Hashing Engine (SHA-256) ]
                                            │
               ┌────────────────────────────┴──────────────────────────┐
               ▼                                                       ▼
      [( Relational Database )]                               [ Merkle Tree Engine ]
               │                                                       │
  (Direct SQL Tamper Attempt)                                   (Leaf Hashes & Root)
               │                                                       │
               ▼                                                       ▼
    [ Tamper Audit Daemon ] ◄─────────────────────────── [ Immutable Append-Only Ledger ]
               │
      (Flags Altered Rows)
```

---

## 👥 3-Person Team Distribution

- **Person 1 — Cryptographic Core & Backend Engine:**
  - Merkle tree construction, leaf hashing, and proof generation endpoints.
  - Ed25519 dual-signature verification & append-only revision ledger.
- **Person 2 — Full-Stack Frontend & Verification UX:**
  - Student marksheet layout and print formatting.
  - Client-side webcam/upload QR scanner and cryptographic proof verifier.
  - Dual-admin approval interface.
- **Person 3 — Data Pipeline, Tamper Audit Daemon & Judge Defense:**
  - Bulk CSV ingestion and performance optimization.
  - Continuous database tamper auditor and alert visualizer.
  - Automated break-test suite (`judge_simulator.py`) for live judging.

---

## 🚀 Quickstart & Setup Guide
*(Detailed setup instructions will be updated as modules are developed)*
