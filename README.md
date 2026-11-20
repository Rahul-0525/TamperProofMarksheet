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

## 🏛️ Enterprise Multi-Portal Architecture

VeriMark decouples user experiences into 4 role-isolated institutional portals:

1. **Student & Public Credential Portal (`/` & `/marksheet/:roll_no`):**
   - Clean roll number search for students and parents.
   - Formal single-page printable transcript (`@media print` formatted) with dynamic QR code.
2. **Third-Party Verification Portal (`/verify`):**
   - Designed for employers, recruiters, and foreign universities.
   - Webcam scanner + file uploader supporting **100% offline client-side Merkle proof verification**.
3. **Executive Governance Chamber (`/governance`):**
   - Accessible by Dean of Academic Affairs & Controller of Examinations.
   - Dual-signature Ed25519 authorization for re-evaluation grade amendments.
4. **Forensic Security & Tamper Audit Console (`/audit`):**
   - Continuous daemon that scans live database rows against the immutable Merkle Root.
   - Features the **Evaluator Break-Test Sandbox** for live judge SQL injection testing.
5. **Office of the Registrar (`/admin`):**
   - Bulk CSV ingestion (`POST /api/admin/publish-batch`) hashing 1,500+ records into the Merkle tree in $< 2$ seconds.

*(For hackathon evaluators, a top Persona Switcher allows seamless switching between these institutional roles during the 5-minute live demo).*

---

## 👥 3-Person Team Distribution & Guides

- **Onboarding Guide for Laptops:** [`docs/ONBOARDING_AND_GIT_SETUP.md`](docs/ONBOARDING_AND_GIT_SETUP.md)
- **Backend Guide & AI Agent Directive:** [`docs/BACKEND_GUIDE.md`](docs/BACKEND_GUIDE.md)
- **Backend Integration & Handoff Guide:** [`docs/BACKEND_INTEGRATION_GUIDE.md`](docs/BACKEND_INTEGRATION_GUIDE.md)
- **Frontend Guide & AI Agent Directive:** [`docs/FRONTEND_GUIDE.md`](docs/FRONTEND_GUIDE.md)
- **Shared API & Cryptographic Contracts:** [`contracts/CONTRACT_SPEC.md`](contracts/CONTRACT_SPEC.md)

---

## ⚡ Evaluator Test Criteria (Target Metrics)

1. **Hidden Test Data (40% Weight):**
   - Bulk ingestion of 1,500+ records in $< 2$ seconds.
   - Proof generation and verification latency $< 50\text{ ms}$.
2. **Direct DB Tamper Detection (20% Technical Depth):**
   - Immediate detection and pinpointing of direct SQL tampering (`UPDATE results SET marks = 99`).
3. **Viva Understanding (15% Weight):**
   - Every team member has a dedicated viva preparation section in their guide to explain code concepts on demand.
4. **Mandatory Vercel Deployment:**
   - 1-click frontend deployment on Vercel with SPA rewrite rules in `frontend/vercel.json`.

---

## 🚀 Quickstart & Setup Guide
*(Detailed setup instructions will be updated as modules are developed)*
