# 🎨 Frontend Team & AI Agent Master Guide

Welcome to the Frontend engineering track for **VeriMark (H8)**.
This document contains the exact instructions for your AI agent and the human developer to build a modern, high-speed UI optimized for **1-click Vercel deployment** and live evaluator demonstrations.

---

## 🏛️ Real-World Multi-Portal Architecture & Separation of Roles

To satisfy the hackathon criterion **"Usability and design (10%): Works for the real user named in the problem"**, VeriMark cleanly separates the user experience into 4 dedicated, role-isolated portals:

1. **Student & Public Credential Portal (`/` and `/marksheet/:roll_no`):**
   - **User:** Students, parents, general public.
   - **Features:** Clean search box to look up roll numbers, formal printable transcript (`@media print` formatted for clean paper output), and the printed cryptographic QR code.
   - **Security:** Zero access to admin actions, no database tampering tools, and no signature panels.

2. **Third-Party Verification Portal (`/verify`):**
   - **User:** Background verification agencies, corporate recruiters (e.g. Google, TCS, Infosys HR), and foreign universities.
   - **Features:** Live webcam QR scanner and marksheet image/PDF upload. Calculates the SHA-256 leaf and climbs the Merkle audit path to verify against the published root hash.
   - **Key Evaluator Metric:** Works **100% offline in airplane mode** via the native browser Web Crypto API!

3. **Executive Governance Chamber (`/governance`):**
   - **User:** University Leadership — **Dean of Academic Affairs** and **Controller of Examinations**.
   - **Features:** Strict multi-signature governance docket. To prevent bribery or single-clerk manipulation, mark amendments require two independent Ed25519 digital cryptographic signatures before the database allows an update and mints a new ledger root.

4. **Security Operations & Forensic Auditor Console (`/audit`):**
   - **User:** University Vigilance Officers & **Hackathon Judges**.
   - **Features:** Real-time continuous audit daemon that scans all SQL records against the immutable Merkle Root. Includes the **Evaluator Break-Test Sandbox** where judges can inject direct SQL mutations (`UPDATE subject_marks SET marks_obtained = 99`) and immediately watch the daemon sound the alarm and pinpoint the exact modified roll number and subject.

5. **Office of the Registrar (`/admin`):**
   - **User:** Examination Branch Registrar.
   - **Features:** Bulk CSV ingestion (`results_sample.csv`) that computes 1,500+ Merkle leaf hashes in $< 2$ seconds and publishes the batch.

---

## 🎙️ How to Present This Architecture to Evaluators (Winning Script)

When the judges evaluate your project, explain the UI separation like this:

> *"Judges, in a real university production deployment, these 4 portals are physically decoupled into separate micro-frontends hosted on isolated internal subdomains: `results.university.edu` for students, `verify.university.edu` for employers, `board.internal.edu` for the Dean & Controller, and `audit.security.edu` for vigilance.*  
> *For the purpose of this 5-minute hackathon evaluation, our top header includes an **Institutional Persona Switcher** so you can seamlessly evaluate each actor's view without the friction of logging into 4 separate laptops."*

---

## 🤖 Prompt to Paste into Teammate 2's AI Assistant

```markdown
You are the Senior Frontend Engineer and Technical Mentor for VeriMark (Code Fuzion 2026 - Problem H8: Tamper-Proof Exam Result Ledger).
You are collaborating with a human teammate.

YOUR DUAL RESPONSIBILITY:
1. Build an aesthetic, fast, responsive web application inside `/frontend` using React (Vite) + Tailwind CSS + Lucide Icons.
2. PROACTIVELY GUIDE YOUR HUMAN DEVELOPER step-by-step: tell them exactly what commands to run in their terminal, help them debug in the browser, remind them to make granular git commits, and explain the code concepts clearly so they can pass the judges' random viva examination.

PROJECT CONSTRAINTS & SPECIFICATIONS:
- Read `contracts/CONTRACT_SPEC.md` and `contracts/types.ts`. All interfaces, state objects, and API calls must strictly match these files.
- Environment Variable: Use `import.meta.env.VITE_API_URL || 'http://localhost:8000/api'` for all backend communication.
- Vercel Deployment Ready: Ensure a `vercel.json` exists with rewrite rules `[{"source": "/(.*)", "destination": "/"}]` so client-side routing never causes 404 on refresh.

CORE PAGES & COMPONENTS TO BUILD:
1. `src/pages/MarksheetView.tsx` (`/marksheet/:roll_no`):
   - Formal university transcript layout (University crest, student info, subject grade table, GPA, Total, Pass/Fail status).
   - "Print Official Marksheet" button formatted for clean single-page printing.
   - Dynamic QR Code (using `qrcode.react`) embedding the compact verification payload (`CompactQRPayload`).
2. `src/pages/VerifyPortal.tsx` (`/verify`):
   - Supports dual input: Live Webcam QR scanner (using `html5-qrcode`) OR Drag-and-drop mark-sheet image upload.
   - Cryptographic Proof Breakdown:
     - Calculates leaf hash from the scanned data.
     - Iterates along the Merkle audit path to recalculate the root.
     - Compares with the ledger's published root.
   - High-impact UI: Displays large Green "VERIFIED AUTHENTIC" badge with an interactive visual tree of the audit path, OR Red "TAMPER DETECTED / FORGED MARKSHEET" banner.
3. `src/pages/GovernancePortal.tsx` (`/governance`):
   - Displays pending mark correction requests.
   - Dual-Approval panel allowing the user to switch between "Dean of Academics" and "Controller of Examinations" personas, inspect the justification, and digitally sign using Ed25519 keys.
   - Shows real-time progress: `0/2 Signatures` -> `1/2 Signed (Waiting for Controller)` -> `Approved & Committed to Ledger`.
4. `src/pages/AuditDashboard.tsx` (`/audit`):
   - "Audit Ledger & Database Now" button that calls `GET /api/audit/integrity-check`.
   - Real-time status banner: Pulsing Green ("All Records Cryptographically Secure") vs Flashing Red ("Direct DB Tampering Detected!").
   - If tampered, displays a red table pinpointing the exact student, roll number, and tampered subject marks.

GUIDANCE PROTOCOL:
- Never edit files outside `/frontend`.
- Guide the user with clear command snippets: e.g. how to run `npm install`, install required packages (`lucide-react`, `html5-qrcode`, `qrcode.react`, `axios`), and start `npm run dev`.
- After every completed milestone, remind the user to run `git commit` with a clear message (e.g. `feat(frontend): implement client-side Merkle proof verifier and webcam scanner`).
```

---

## 🛠️ Step-by-Step Local Developer Commands

Tell your teammate to run these commands inside their terminal:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (React + Vite + Tailwind)
npm install

# 3. Start development server
npm run dev
```
The app will run at `http://localhost:5173` with instant hot-reloading.

---

## 🚀 Vercel 1-Click Deployment Setup

To deploy the frontend to Vercel in 60 seconds:
1. Push your branch to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import `TamperProofMarksheet`.
4. Set **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed backend URL (or fallback API URL).
6. Click **Deploy**. Vercel will build and assign a live HTTPS URL (e.g., `https://verimark.vercel.app`).

---

## 🎓 Viva Preparation: How to Explain Frontend Code to Judges

If the judges pick you at random to explain the frontend:
1. **Explain the QR Code Payload:**
   *"Instead of just encoding a dumb URL, our marksheet QR code carries the cryptographic leaf hash, the published root hash, and the compact Merkle audit path. This means our verification portal can perform mathematical verification even if the phone has zero internet connection!"*
2. **Explain Client-Side Verification:**
   *"When a user scans a marksheet, the browser runs the exact same SHA-256 hashing algorithm on the student data and re-computes the parent hashes up to the root. If a single digit was edited on Photoshop or in the database, the computed root will not match the immutable ledger root."*
3. **Explain the Governance UI:**
   *"The governance dashboard demonstrates separation of powers. A single corrupt admin cannot click 'Save' to change a grade. Both the Dean and Controller must review the request and independently sign with distinct cryptographic keys."*
