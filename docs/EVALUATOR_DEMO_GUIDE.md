# 🏆 5-Minute Evaluator Demo Script & Winning Presentation Guide
**Code Fuzion 2026 — Problem H8: Tamper-Proof Exam Result Ledger**  
*TruGrade: Engineered for Lovely Professional University (LPU)*

Use this exact script when evaluators visit your table. Don't show login forms or speak in abstract theory. Follow this high-impact, live-action storyline.

---

## ⏱️ Minute-by-Minute Demo Flow

### 0:00 – 0:45 | The Problem & The Solution
> *"Judges, university transcripts suffer from insider corruption: database administrators or compromised credentials quietly updating marks directly in SQL, leaving students unable to prove what their original grade was.*  
> *We built **TruGrade**: a cryptographic result publishing ledger for Lovely Professional University where every published score is deterministically serialized and hashed into an immutable binary Merkle tree. Legitimate corrections require dual cryptographic signatures (Dean + Controller), and our continuous audit daemon catches and pinpoints unauthorized raw database edits within milliseconds."*

---

### 0:45 – 1:45 | The 4 Role-Isolated Portals & Aesthetic Design
Point to the top header on `http://localhost:5173` (or live Vercel URL):
> *"In a real university production environment, students, auditors, and university leadership must never share the same interface. These are dedicated portals running on isolated institutional subdomains:*
> 1. *`results.lpu.in` — **Student Transcript Portal:** Clean roll number search (`2024CS001`) with an official `@media print` transcript layout.*
> 2. *`verify.lpu.in` — **Third-Party Verifier:** For HR and foreign universities to scan the printed QR code.*
> 3. *`governance.lpu.in` — **Governance Chamber:** For Dean of Academics and Controller of Examinations to review re-evaluation requests.*
> 4. *`audit.lpu.in` — **Security Operations Console:** For auditors to monitor ledger integrity and run break-tests.*
> 
> *Our design follows a modern Dribbble architectural aesthetic in muted forest greens (`#1f2f22`, `#3e5640`, `#94a789`, `#7a94a1`) with warm amber accents, ambient mist movement, and full mobile responsiveness."*

---

### 1:45 – 2:45 | The 100% Offline QR Verification & Smart Camera
1. Navigate to `/marksheet/2024CS001` $\to$ show the printed QR code in the bottom corner.
2. Navigate to `/verify`:
> *"Our QR code does not contain a simple web URL. It contains the student's canonical leaf hash, the university's root hash, and the compact Merkle audit path.*  
> *When scanned on a phone, our system automatically targets the **mobile rear camera**; on a laptop webcam, it automatically **mirrors the video feed** horizontally so movement feels natural.*  
> *The browser executes the **native Web Crypto API** in JavaScript to climb the Merkle tree. This means verification works **100% offline in airplane mode** without pinging our server!"*
3. Show the green **"100% Authentic"** badge and expand the interactive **Merkle Path Visualizer** showing the exact hash steps.

---

### 2:45 – 4:00 | The Showstopper: Direct SQL Tampering Break-Test
> *"Now let's test what happens when someone bypasses our application and directly modifies the database."*

1. Open the `/audit` portal or the terminal (`python tests/evaluator_cli.py`).
2. Show the evaluator the healthy state: **`HEALTH: SECURE — 100% Records Match Immutable Ledger`**.
3. Invite the judge or click **"Simulate Direct SQL Tamper"**:
   - Executes raw SQL: `UPDATE subject_marks SET marks_obtained = 99 WHERE roll = '2024CS003';`
4. Click **"Audit Database Now"**:
   - Screen instantly alerts: **`TAMPER DETECTED!`**
   - Show the discrepancy table:
     > **Roll No:** 2024CS003 (Rohan Verma)  
     > **Field:** CS502 (Database Management Systems)  
     > **Stored in DB:** 99  
     > **Original in Immutable Ledger:** 72  
     > **Verdict:** Unauthorized direct SQL mutation bypassing dual-approval governance!

---

### 4:00 – 4:45 | Legitimate Grade Correction (Dual-Key Ed25519)
> *"What if a grade genuinely needs correction after official re-evaluation?"*

1. Switch to `/governance`.
2. Show the pending proposal for student re-evaluation.
3. Show **Dean of Academics** applying their digital signature $\to$ status moves to `1/2 Signed (Pending Controller)`.
4. Switch to **Controller of Examinations** and apply their signature $\to$ status moves to `Approved & Committed to Ledger`.
5. The system recalculates the Merkle Root, signs the new transaction, and records an immutable audit trail.

---

### 4:45 – 5:00 | Conclusion & Impact
> *"TruGrade guarantees complete mathematical transparency for university grading. Transcripts cannot be forged, database tampering is isolated in milliseconds, and students carry tamper-proof, offline-verifiable credentials for life. Thank you!"*
