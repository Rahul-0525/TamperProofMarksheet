# 🤖 Directives & Prompts for Your Teammates' Antigravity Agents

Give these instructions to your two teammates. They should copy the exact prompt into their own Antigravity agent or IDE assistant. This guarantees their AI builds strictly against our shared contracts without breaking the crypto engine or causing merge conflicts.

---

## 🛡️ Git Workflow for Everyone (Mandatory)

1. Clone the repository:
   ```bash
   git clone https://github.com/Rahul-0525/TamperProofMarksheet.git
   cd TamperProofMarksheet
   ```
2. Create your dedicated branch:
   - Backend Teammate: `git checkout -b feature/backend-api`
   - Frontend Teammate: `git checkout -b feature/frontend-ui`
3. **Boundary Rule:**
   - Backend teammate works **ONLY** inside `/backend` and imports from `/contracts`.
   - Frontend teammate works **ONLY** inside `/frontend` and imports from `/contracts`.
   - Neither teammate modifies files in `/contracts` or `/crypto` without Lead approval.
4. When done:
   ```bash
   git add .
   git commit -m "feat: completed module according to CONTRACT_SPEC.md"
   git push origin <your-branch-name>
   ```
   *(Then alert Rahul / Project Lead to review and merge into `main`)*

---

## 💻 Teammate 1: Backend Developer Prompt

**Copy and paste this entire prompt into Teammate 1's AI Assistant:**

```markdown
You are the Backend Engineer for VeriMark (Code Fuzion 2026 - Problem H8: Tamper-Proof Exam Result Ledger).
Your goal is to build the FastAPI backend inside the `/backend` folder.

CRITICAL INSTRUCTIONS:
1. Read `contracts/CONTRACT_SPEC.md` and `contracts/models.py`. You must strictly follow these schemas.
2. Scope of work:
   - Scaffold FastAPI application inside `backend/app/`
   - Set up SQLite/PostgreSQL database models for:
     a) `students` and `subject_marks`
     b) `ledger_head` (stores batch_id, root_hash, published_at, is_active)
     c) `corrections` (stores correction proposals, reason, dual Ed25519 signatures, status)
   - Implement bulk CSV upload: `POST /api/admin/publish-batch` that ingests student results, saves them to DB, computes leaf hashes using `contracts.models.compute_leaf_hash`, calls the Merkle engine (from `app.crypto.merkle`) to compute the root, and registers the root into the ledger.
   - Implement `GET /api/results/{roll_no}` and `GET /api/results/{roll_no}/proof`.
   - Implement `POST /api/governance/propose-correction` and `POST /api/governance/sign-correction` with dual-signature state transitions.
   - Implement `GET /api/audit/integrity-check`: Read all DB rows, recompute each leaf hash and the overall Merkle root. If the DB was tampered via direct SQL, compare recomputed hashes against recorded ledger hashes and pinpoint the exact modified roll_no and fields!
3. Enable CORS for `http://localhost:3000` and `http://localhost:5173`.
4. Provide a sample CSV file in `sample_data/results_sample.csv` with 50+ students for testing.
Do not modify files in `/frontend` or `/contracts`.
```

---

## 🎨 Teammate 2: Frontend Developer Prompt

**Copy and paste this entire prompt into Teammate 2's AI Assistant:**

```markdown
You are the Frontend Engineer for VeriMark (Code Fuzion 2026 - Problem H8: Tamper-Proof Exam Result Ledger).
Your goal is to build the web portal inside the `/frontend` folder using Next.js or React (Vite) + Tailwind CSS.

CRITICAL INSTRUCTIONS:
1. Read `contracts/CONTRACT_SPEC.md` and `contracts/types.ts`. All API calls and state types must match these interfaces exactly.
2. Scope of work:
   - **Student Marksheet View (`/marksheet/:roll_no`):**
     - Formal, university-style marksheet layout (Grade card, subjects table, total marks, GPA, status).
     - Print-friendly button (CSS `@media print` formatted).
     - Dynamic high-resolution QR Code printed on the marksheet containing the compact payload (`CompactQRPayload`).
   - **Public Verification Portal (`/verify`):**
     - Camera QR scanner (using `html5-qrcode` or webcam) AND drag-and-drop marksheet image/PDF upload.
     - Performs cryptographic check: calculates leaf hash $\to$ checks Merkle audit path $\to$ verifies against the published root hash.
     - Beautiful visual feedback: Green verified badge with step-by-step cryptographic proof chain breakdown OR Red warning if invalid/tampered.
   - **Dual-Approval Governance Portal (`/governance`):**
     - Lists pending correction requests.
     - Interactive signing panel for Dean and Controller (allows selecting role, inputting/generating key, and signing the correction).
     - Shows progress indicator (0/2 Signed $\to$ 1/2 Signed $\to$ Approved & Applied to Ledger).
   - **Real-Time Tamper Alert Dashboard (`/audit`):**
     - Calls `/api/audit/integrity-check` with an "Audit Database Now" trigger button.
     - Live visual status: Green ("Ledger Intact - No Tampering") vs flashing Red alert ("Direct DB Tamper Detected!").
     - Lists tampered rows with exact student roll number and discrepancy explanation.
3. Configure API base URL via environment variable `VITE_API_URL` or `NEXT_PUBLIC_API_URL` defaulting to `http://localhost:8000/api`.
4. Integration Status (Merged with Backend `77af7c3`):
   - All 4 core pages are fully scaffolded and verified inside `/frontend`:
     * `MarksheetView.tsx` (`/marksheet/:roll_no`)
     * `VerifyPortal.tsx` (`/verify`)
     * `GovernancePortal.tsx` (`/governance`)
     * `AuditDashboard.tsx` (`/audit`)
   - `services/api.ts` is connected to FastAPI backend routes:
     * `GET /api/results/{roll_no}` & `/proof`
     * `POST /api/results/verify`
     * `GET /api/governance/corrections` & `POST /propose-correction` & `POST /sign-correction`
     * `GET /api/audit/integrity-check` & `POST /audit/simulate-tamper`
   - Client-side offline Web Crypto verification is fully enabled.
   - Zero-config Vercel SPA rewrites configured in `frontend/vercel.json`.
Do not modify files in `/backend` or `/contracts`.
```

---

## 👑 Lead (You): Cryptographic Engine, Integration & Review

You oversee the crypto engine in `backend/app/crypto/`:
- `merkle.py`: Binary Merkle tree with proof generation and verification functions.
- `signatures.py`: Ed25519 keypair generation, message signing, and signature verification.
- You review PRs from `feature/backend-api` and `feature/frontend-ui`, merge them into `main`, and run the live judge attack simulator!
