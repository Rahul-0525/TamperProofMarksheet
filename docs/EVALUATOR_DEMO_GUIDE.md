# 🏆 5-Minute Evaluator Demo Script & Winning Presentation Guide
**Code Fuzion 2026 — Problem H8: Tamper-Proof Exam Result Ledger**

Use this exact script when evaluators visit your table. Don't show login forms or speak in abstract theory. Follow this high-impact, live-action storyline.

---

## ⏱️ Minute-by-Minute Demo Flow

### 0:00 – 0:45 | The Problem & The Solution
> *"Judges, university transcripts suffer from insider corruption: database administrators or compromised credentials quietly updating marks directly in SQL, leaving students unable to prove what their original grade was.*  
> *We built **VeriMark**: a result publishing system where every published score is deterministically serialized and hashed into an immutable binary Merkle tree. Legitimate corrections require dual cryptographic signatures (Dean + Controller), and our continuous audit daemon catches and pinpoints unauthorized raw database edits within milliseconds."*

---

### 0:45 – 1:45 | The 4 Role-Isolated Portals
Point to the top header on `http://localhost:5173`:
> *"In a real university production environment, students, auditors, and university leadership must never share the same interface. These are 4 decoupled portals running on isolated institutional subdomains:*
> 1. *`results.edu` — **Student Transcript Portal:** Clean roll number search (`2024CS001`) and `@media print` transcript layout.*
> 2. *`verify.edu` — **Third-Party Verifier:** For HR and foreign universities to scan the printed QR code.*
> 3. *`board.internal.edu` — **Governance Chamber:** For Dean and Controller of Examinations to review re-evaluation requests.*
> 4. *`audit.security.edu` — **Security Operations Console:** For auditors to monitor ledger integrity and run break-tests.*
> 
> *For this 5-minute evaluation, our top **Persona Switcher** lets you inspect each actor's view without logging into 4 separate laptops."*

---

### 1:45 – 2:45 | The 100% Offline QR Verification
1. Navigate to `/marksheet/2024CS001` $\to$ show the printed QR code in the bottom corner.
2. Navigate to `/verify`:
> *"Our QR code does not contain a simple web URL. It contains the student's canonical leaf hash, the university's root hash, and the compact Merkle audit path.*  
> *When scanned, the browser executes the **native Web Crypto API** in JavaScript to climb the Merkle tree. This means verification works **100% offline in airplane mode** without pinging our server!"*
3. Show the green **"100% Authentic"** badge and expand the interactive **Merkle Path Visualizer** showing the exact hash steps.

---

### 2:45 – 4:00 | The Showstopper: Direct SQL Tampering Break-Test
> *"Now let's test what happens when someone bypasses our application and directly modifies the database."*

1. Open the `/audit` portal or the terminal (`python tests/evaluator_cli.py`).
2. Show the evaluator the healthy state: **`HEALTH: SECURE — 100% Records Match Immutable Ledger`**.
3. Invite the judge or click **"Simulate Direct SQL Tamper"**:
   - Executes raw SQL: `UPDATE subject_marks SET marks_obtained = 99 WHERE roll = '2024CS003';`
4. Click **"Audit Database Now"**:
   - Screen instantly turns into a **Flashing Red Siren: `TAMPER DETECTED!`**
   - Show the discrepancy table:
     > **Roll No:** 2024CS003 (Rohan Verma)  
     > **Field:** CS502 (Database Management Systems)  
     > **Stored in DB:** 99  
     > **Original in Immutable Ledger:** 72  
     > **Verdict:** Unauthorized direct SQL mutation bypassing dual-approval governance!

---

### 4:00 – 4:45 | Legitimate Grade Correction (Dual-Key Ed25519)
> *"What if a grade genuinely needs correction after re-evaluation?"*

1. Switch to `/governance`.
2. Show the pending proposal for student re-evaluation.
3. Show **Dean of Academics** applying their digital signature $\to$ status moves to `1/2 Signed (Pending Controller)`.
4. Show **Controller of Examinations** applying their independent digital signature $\to$ status becomes `Approved & Committed`.
5. Point out:
   - Mark in DB is updated.
   - An immutable revision entry is logged with both digital signatures and timestamps.
   - A new Merkle Root is minted, and the `/audit` screen returns to **`SECURE`**.

---

### 4:45 – 5:00 | The Viva Defense (Closing)
> *"Any member of our team is ready to walk you through the Merkle tree tree-building algorithm, the canonical serialization formula, or the Ed25519 signature equations on a whiteboard."*
