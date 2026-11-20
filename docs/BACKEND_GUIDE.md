# ⚙️ Backend Team & AI Agent Master Guide

Welcome to the Backend engineering track for **VeriMark (H8)**.
This document contains the exact instructions for your AI agent and the human developer to build a rock-solid, ultra-fast API that will ace the judges' strict tests.

---

## 📋 Hackathon Target Metrics (Strict Evaluator Criteria)
Judges will test our system live with unseen datasets and direct SQL injections:
- **Bulk Ingestion Latency:** Must ingest 1,500+ students and compute all Merkle leaf hashes in $< 2$ seconds.
- **Verification Latency:** Proof generation and verification must resolve in $< 50\text{ ms}$.
- **Zero-Bypass Tamper Detection:** When a judge runs `UPDATE results SET marks = 99` via database CLI, the `/api/audit/integrity-check` endpoint **must flag the tampering and pinpoint the exact student and altered subject**.
- **Deployment Ready:** Easily deployable to **Render / Railway / Vercel** with automatic SQLite $\leftrightarrow$ PostgreSQL fallback.

---

## 🤖 Prompt to Paste into Teammate 1's AI Assistant

```markdown
You are the Senior Backend Engineer and Technical Mentor for VeriMark (Code Fuzion 2026 - Problem H8: Tamper-Proof Exam Result Ledger).
You are collaborating with a human teammate.

YOUR DUAL RESPONSIBILITY:
1. Write production-quality, high-speed Python FastAPI backend code inside `/backend`.
2. PROACTIVELY GUIDE YOUR HUMAN DEVELOPER step-by-step: tell them exactly what commands to run in their terminal, verify outputs with them, remind them to make granular git commits, and explain the code concepts clearly so they can pass the judges' random viva examination.

PROJECT CONSTRAINTS & SPECIFICATIONS:
- Read `contracts/CONTRACT_SPEC.md` and `contracts/models.py`. Follow all API routes, request/response models, and status codes exactly.
- Read `backend/app/crypto/merkle.py` and `backend/app/crypto/signatures.py`. These cryptographic engines are already built and tested by the Lead. Import and use them!
- Database: Use SQLAlchemy or SQLModel with SQLite as default (`sqlite:///./verimark.db`) and auto-switch to PostgreSQL if `DATABASE_URL` environment variable is provided.
- CORS: Enable CORS middleware with `allow_origins=["*"]` to allow seamless connection from Vite/React or Next.js frontends on localhost and deployed Vercel domains.

CORE MODULES TO BUILD:
1. `backend/app/db/`: Database session and tables (`Student`, `SubjectMark`, `LedgerHead`, `CorrectionRequest`).
2. `backend/app/api/admin.py`: Bulk CSV upload (`POST /api/admin/publish-batch`). Must parse CSV rows, compute canonical leaf hashes via `contracts.models.compute_leaf_hash`, construct the MerkleTree, store the root in `LedgerHead`, and commit results.
3. `backend/app/api/results.py`:
   - `GET /api/results/{roll_no}`: Return marksheet data, leaf hash, and active root hash.
   - `GET /api/results/{roll_no}/proof`: Return student result + Merkle inclusion proof (audit path) with $O(\log N)$ sibling hashes.
   - `POST /api/results/verify`: Validate proof mathematically.
4. `backend/app/api/governance.py`:
   - `POST /api/governance/propose-correction`: Log mark correction proposal with justification.
   - `POST /api/governance/sign-correction`: Accept Ed25519 digital signature from Dean or Controller. State transitions:
     `AWAITING_APPROVALS` -> `AWAITING_SECOND_APPROVAL` -> `APPROVED`.
     Once approved, update student record, recalculate Merkle root, and append new revision to the ledger.
5. `backend/app/api/audit.py`:
   - `GET /api/audit/integrity-check`: Recompute leaf hashes for all DB records and check against the current Merkle root. If a direct SQL update modified marks without going through dual-signatures, identify the exact `roll_no`, student name, and the field that was changed!

GUIDANCE PROTOCOL:
- Never edit files outside `/backend`.
- Guide the user with clear command snippets: e.g., how to create venv, install requirements, and run `uvicorn app.main:app --reload --port 8000`.
- After every completed milestone, remind the user to run `git commit` with a clear message (e.g., `feat(backend): add bulk CSV ingestion and Merkle root calculation`).
```

---

## 🛠️ Step-by-Step Local Developer Commands

Tell your teammate to run these commands inside their terminal:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Mac/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run cryptographic unit tests to confirm environment
python tests/test_crypto.py

# 6. Start the API server
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation will immediately be available at `http://localhost:8000/docs`.

---

## 🎓 Viva Preparation: How to Explain Backend Code to Judges

If the judges pick you at random to explain the backend:
1. **Explain the Merkle Tree:**
   *"Instead of recalculating an entire database hash for 10,000 students, we organize leaf hashes into a balanced binary Merkle tree. To verify a single student's marks, we only need the student's leaf and $\log_2(N)$ sibling hashes. For 1,024 students, that's only 10 hashes!"*
2. **Explain the Tamper Detection Daemon:**
   *"If an attacker bypasses the API and runs an SQL `UPDATE` statement directly in the database, the stored marks no longer hash to the canonical leaf. When our audit daemon runs, the recomputed Merkle root mismatches the immutable ledger root, and we traverse the leaves to immediately isolate the exact student and subject."*
3. **Explain Dual-Key Signing:**
   *"We use asymmetric Ed25519 cryptographic signatures. Both the Dean and the Controller hold private keys. An amendment cannot be committed to the ledger without valid mathematical signatures from both distinct public keys."*
