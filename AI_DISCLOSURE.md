# 🤖 Official AI Usage Declaration
**Code Fuzion 2026 — Official Submission Requirement**

*Rule: "AI use must be declared: which tools, and for which parts of the code. If no team member can explain a core part of the code in the viva, that part scores zero."*

---

## 🛠️ Tools Utilized
- **Google Antigravity Agent:** Architecture design, cryptographic validation, contract modeling, test scaffolding, and documentation.
- **Human Authorship & Decision Making:**
  - System architecture and separation of duties (Registrar vs. Dean/Controller vs. Security Auditor).
  - Deterministic canonical serialization format to prevent cross-language hashing mismatches.
  - Test scenario design for adversarial break-tests (direct SQL injections, bit-flip QR payloads, replay attacks).
  - Full code comprehension: all team members have completed viva drills to explain all cryptographic and database mechanisms.

---

## 📂 Component-by-Component Declaration

| Component | Files | Human Role | AI Role |
| :--- | :--- | :--- | :--- |
| **Cryptographic Core** | `backend/app/crypto/merkle.py`<br>`backend/app/crypto/signatures.py` | Selected binary Merkle tree standard and Ed25519 digital signatures. Designed canonical string formula. | Scaffolded hashing logic, tree traversal, and signature verification functions. |
| **Backend API & Database** | `backend/app/api/`<br>`backend/app/db/` | Defined relational schema, SQL injection attack vectors, and dual-signature state machine. | Generated FastAPI route handlers, Pydantic validators, and SQLAlchemy bulk insertion queries. |
| **Frontend Portals** | `frontend/src/pages/`<br>`frontend/src/components/` | Conceived the 4 role-isolated portals (Student, Verifier, Governance, Auditor) and Persona Switcher. | Built React components, Tailwind styling, and Web Crypto client-side verification. |
| **Adversarial Test Suite** | `backend/tests/test_adversarial_suite.py`<br>`backend/tests/evaluator_cli.py` | Defined edge cases: 2,000 students, Punjabi UTF-8 strings, QR bit-flips, direct SQL injection. | Generated test scripts, mock CSV generation, and interactive CLI console. |
| **Documentation & Guides** | `README.md`<br>`docs/*`<br>`contracts/*` | Formulated contract-first team methodology and presentation talking points. | Formatted and documented technical contracts and API guides. |

---

## 🎓 Viva Competency Statement
Every team member has read the codebase, understands the Merkle tree inclusion math, the Ed25519 digital signature protocol, and the direct database audit daemon. Any member can independently explain any function when called upon by the evaluators.
