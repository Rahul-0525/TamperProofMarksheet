# 📜 VeriMark — System Architecture & Shared API/Data Contract

This document is the **Single Source of Truth** for the entire team.
- **Project Lead (You):** Merkle tree crypto engine, Ed25519 multi-signature governance, Git merging & integration.
- **Teammate 1 (Backend):** FastAPI routes, SQLite/PostgreSQL models, CSV bulk ingestion, and continuous Tamper Detection Daemon.
- **Teammate 2 (Frontend):** Next.js/React + Tailwind UI, Marksheet layout & PDF print, Mobile QR webcam/file scanner, Dual-sign approval portal, Live Auditor dashboard.

---

## 1. Cryptographic Rules (Non-Negotiable)

### A. Canonical String Format for Leaf Hashing
Any difference in key ordering, whitespace, or date formatting breaks SHA-256 hashes across different programming languages. Therefore, all leaf hashes **must** use the following canonical string:

```
canonical_string = "{roll_no}|{student_name}|{course}|{semester}|{sorted_subjects}|{total_marks}|{max_total}|{gpa}|{result_status}|{salt}"
```

Where:
- `sorted_subjects` is formatted as: `{subject_code}:{marks_obtained}:{max_marks}` joined by `;`, **sorted alphabetically by `subject_code`**.
- Example: `"CS501:85:100;CS502:78:100;CS503:92:100"`
- `salt`: an 8-character hex string generated at publishing time to preserve privacy.
- `leaf_hash = SHA256(canonical_string).hexdigest().lower()`

### B. Binary Merkle Tree
- If leaves count $N$ is odd, duplicate the last leaf hash (standard RFC 6962).
- Node hash: `parent = SHA256(left_child + right_child).hexdigest().lower()`.
- Every batch publish produces a immutable `root_hash` committed to the Ledger.

---

## 2. Shared Data Models

### A. Student Record
```json
{
  "roll_no": "2024CS001",
  "student_name": "Aarav Sharma",
  "course": "B.Tech Computer Science",
  "semester": 5,
  "academic_year": "2025-2026",
  "subjects": [
    {
      "subject_code": "CS501",
      "subject_name": "Operating Systems",
      "marks_obtained": 88,
      "max_marks": 100,
      "grade": "A"
    },
    {
      "subject_code": "CS502",
      "subject_name": "Database Management",
      "marks_obtained": 92,
      "max_marks": 100,
      "grade": "A+"
    }
  ],
  "total_marks": 180,
  "max_total": 200,
  "gpa": 9.0,
  "result_status": "PASS",
  "salt": "a8f3b21c",
  "leaf_hash": "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"
}
```

### B. Merkle Inclusion Proof Response
```json
{
  "roll_no": "2024CS001",
  "leaf_hash": "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
  "leaf_index": 0,
  "root_hash": "4f9a88...c72",
  "published_at": "2026-11-20T10:00:00Z",
  "audit_path": [
    {"position": "right", "hash": "7a35..."},
    {"position": "left", "hash": "9c12..."}
  ],
  "is_valid": true
}
```

### C. QR Code Payload (Printed on Marksheet)
To allow **both offline and online instant verification**:
```json
{
  "v": 1,
  "roll": "2024CS001",
  "leaf": "6b86b273...",
  "root": "4f9a88...c72",
  "proof": [
    {"p": "R", "h": "7a35..."},
    {"p": "L", "h": "9c12..."}
  ],
  "verify_url": "https://verimark.edu/verify?roll=2024CS001"
}
```
*(When scanned without internet, the mobile app recalculates leaf $\to$ root using `proof` and checks if it matches `root`. When online, it calls `/api/verify`)*

---

## 3. REST API Contract

Base URL: `http://localhost:8000/api`

### 1. Results & Proofs
- `GET /results/{roll_no}`
  - Returns student marksheet details, `leaf_hash`, and current published `root_hash`.
- `GET /results/{roll_no}/proof`
  - Returns the complete Merkle audit path for the student.
- `POST /results/verify`
  - Body: `{ "leaf_hash": string, "root_hash": string, "audit_path": Array }`
  - Response: `{ "verified": true/false, "calculated_root": string, "expected_root": string }`

### 2. Admin & Publishing
- `POST /admin/publish-batch`
  - Multipart form upload of `results.csv`.
  - Calculates all leaf hashes, constructs Merkle Tree, logs to Ledger, and returns:
    `{ "batch_id": "...", "total_students": 500, "root_hash": "...", "published_at": "..." }`

### 3. Dual-Approval Correction Governance
- `POST /governance/propose-correction`
  - Body:
    ```json
    {
      "roll_no": "2024CS001",
      "subject_code": "CS501",
      "new_marks": 95,
      "reason": "Re-evaluation discrepancy cleared by Board",
      "proposed_by": "Prof. Sharma"
    }
    ```
  - Response: `{ "correction_id": "corr-uuid", "status": "AWAITING_APPROVALS" }`
- `POST /governance/sign-correction`
  - Body:
    ```json
    {
      "correction_id": "corr-uuid",
      "signer_role": "DEAN" | "CONTROLLER",
      "signature": "hex_encoded_ed25519_signature",
      "public_key": "hex_encoded_public_key"
    }
    ```
  - Rules:
    - 1 signature $\to$ Status remains `AWAITING_SECOND_APPROVAL`.
    - 2 signatures (from two distinct roles) $\to$ Status becomes `APPROVED`. The database is updated, an append-only revision entry is added to the Ledger, and a new Merkle Root is published.

### 4. Direct Database Tamper Detection (The Judge Test)
- `GET /audit/integrity-check`
  - Response:
    ```json
    {
      "status": "SECURE" | "COMPROMISED",
      "checked_at": "2026-11-20T22:30:00Z",
      "total_records": 500,
      "active_ledger_root": "4f9a88...c72",
      "recomputed_db_root": "123abc...999",
      "tampered_records": [
        {
          "roll_no": "2024CS042",
          "student_name": "Rohan Verma",
          "issue": "Database row altered: Subject CS502 marks in DB (99) does not produce recorded leaf hash."
        }
      ]
    }
    ```

---

## 4. Git Collaboration Protocol (No Conflicts!)

1. **Branch Names:**
   - Lead (Crypto & Merging): `main` & `feature/crypto-engine`
   - Teammate 1 (Backend): `feature/backend-api`
   - Teammate 2 (Frontend): `feature/frontend-ui`
2. **Directory Separation:**
   - Teammate 1 edits ONLY `/backend`
   - Teammate 2 edits ONLY `/frontend`
   - Lead controls `/contracts`, `/crypto`, root configuration, and performs merges into `main`.
3. Nobody commits directly to `main`. Teammates push their feature branch, and the Lead reviews and merges.
