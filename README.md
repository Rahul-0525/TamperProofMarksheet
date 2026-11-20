# 🌲 TruGrade — Tamper-Proof Exam Result Ledger
### Code Fuzion 2026 — Problem Statement H8 (Hard • 350 Base Points)
*Engineered for Lovely Professional University (LPU) &bull; Organised by Student Organisation Vizion Forge under the aegis of DYA, Student Welfare Wing.*

[![Tests](https://img.shields.io/badge/pytest-7%20passed%20%7C%206%20adversarial%20passed-brightgreen.svg)](backend/tests/)
[![Latency](https://img.shields.io/badge/proof%20latency-33.8ms%20%28target%20%3C50ms%29-blue.svg)](backend/tests/test_performance.py)
[![Ingestion](https://img.shields.io/badge/bulk%201500%20ingestion-1.39s%20%28target%20%3C2.0s%29-blue.svg)](backend/tests/test_performance.py)
[![Architecture](https://img.shields.io/badge/crypto-Merkle%20Tree%20%2B%20Ed25519%20Dual--Key-indigo.svg)](backend/app/crypto/)
[![Design](https://img.shields.io/badge/UI-Dribbble%20Lodge%20%2B%20Muted%20Forest%20Green-emerald.svg)](frontend/)
[![Deployment](https://img.shields.io/badge/Vercel-1--Click%20Deploy%20Ready-black.svg)](vercel.json)

---

## 🎯 Problem Statement (H8)
> *"Marks get changed after publication, and students cannot prove what their original result said.*  
> *Build a result publishing system where every published mark is hashed into an append-only ledger. Any student can verify their result, and any change leaves a visible, signed trail."*

### Core Requirements Solved:
1. **Binary Merkle Tree Ledger:** Every student transcript is canonically serialized and hashed into an immutable Merkle tree. A single student's result is verified with an $O(\log N)$ inclusion proof without revealing other students' marks.
2. **Dual-Key Cryptographic Governance:** Single-administrator edits are mathematically impossible. Amendments require independent Ed25519 digital signatures from both the **Dean of Academic Affairs** and the **Controller of Examinations**.
3. **Printed Marksheet QR Code Verification:** Printed marksheets embed a compact cryptographic payload that verifies **100% offline in airplane mode** via the browser's Web Crypto API.
4. **Real-Time Direct DB Tamper Detection Daemon:** Continuously cross-references live database rows against the immutable ledger root. If an attacker runs a raw SQL update (`UPDATE subject_marks SET marks_obtained = 99`), the daemon flags the tampering in real time and **pinpoints the exact student roll number, name, and modified subject**.

---

## ⚡ Verified Hackathon Benchmarks

All targets measured live on realistic datasets (including Punjabi/Hindi UTF-8 strings, edge scores 0 & 100):

| Criterion | Hackathon Requirement | TruGrade Measured Result | Status |
| :--- | :--- | :--- | :--- |
| **Bulk CSV Ingestion (1,500 students)** | $< 2.0\text{ seconds}$ | **1.398 seconds** | 🟢 **PASS** |
| **Merkle Proof Generation Latency** | $< 50\text{ ms}$ | **33.81 ms** | 🟢 **PASS** |
| **Proof Verification Latency** | $< 50\text{ ms}$ | **8.55 ms** | 🟢 **PASS** |
| **Offline Verification** | Airplane mode compatible | **100% Client-Side Web Crypto** | 🟢 **PASS** |
| **Direct DB Tamper Pinpointing** | Real-time row & column diff | **Accurately isolates roll & subject** | 🟢 **PASS** |
| **Adversarial Test Suite** | Unseen adversarial break-tests | **6 / 6 Gauntlet Tests Passing** | 🟢 **PASS** |

---

## 🌲 Modern Architectural UI & Design System

To satisfy **Usability & Design (10 points)**, TruGrade features a modern, luxury architectural aesthetic inspired by high-end Dribbble lodge booking interfaces and realistic nature cinematography:

- **Atmospheric Background Wallpaper:** High-resolution wide-angle panoramic photograph of a misty evergreen pine forest at dawn with soft morning fog, illuminated trees, and an architectural wooden cabin with warm glowing windows.
- **Muted Forest Green Color Palette:**
  - `#0a0f09` (Deep Muted Forest Base)
  - `#1f2f22` (Deep Spruce Green)
  - `#3e5640` (Muted Evergreen Moss)
  - `#94a789` (Soft Meadow Sage Foliage)
  - `#7a94a1` (Misty Mountain Slate Fog)
  - `#ced9df` (Ethereal Cloud Mist White)
  - `#fbbf24`, `#f59e0b` (Radiant University Amber / Gold)
- **Non-Distracting Ambient Movement:** Subtle 38s Ken Burns breathing zoom on the background photo, dual rolling mist fog waves drifting in counter-directions, and gentle hearth light pulsing from the cabin windows.
- **Smart Camera Hardware Engine:**
  - **Smartphones:** Automatically detects mobile browsers and invokes the **rear camera** (`{ facingMode: "environment" }`) for instant marksheet QR scanning.
  - **Laptops / Desktops:** Uses the front webcam with **horizontal mirroring** (`transform: scaleX(-1)`) so movement and marksheets feel natural like a real mirror.
  - Includes on-screen controls to toggle mirroring and flip between front and rear cameras.
- **Universal Scroll Fly-in Animations:** Powered by `IntersectionObserver` and `MutationObserver` in `useScrollObserver.ts` so all cards, headers, tables, and dynamically mounted results glide smoothly into view.
- **Minimalist Institutional Footer:** Sleek, low-profile ribbon featuring the official vector LPU crest shield, university accreditation (`NAAC A++`), and active cryptographic ledger status.

---

## 🏛️ Enterprise Role-Isolated Portals

1. **Student & Public Credential Portal (`/` & `/marksheet/:roll_no`):**
   - Clean roll number search for students and parents.
   - Animated flowing color gradient headline on the public ledger.
   - Official single-page printable transcript (`@media print` formatted for clean paper output) with dynamic QR code.
   - Built-in 4-student cohort with instant sample pills (`2024CS001` through `2024CS004`).
2. **Third-Party QR Verification Portal (`/verify`):**
   - Designed for corporate employers (e.g. Google, TCS HR) and foreign universities.
   - Smart dual camera scanner and file uploader supporting **100% offline client-side Merkle proof verification**.
3. **Office of the Registrar (`/admin`):**
   - Bulk CSV ingestion (`results_sample.csv`) that computes 1,500+ Merkle leaf hashes in $< 1.4$ seconds.
4. **Executive Governance Chamber (`/governance`):**
   - Accessible by Dean of Academic Affairs & Controller of Examinations.
   - Enforces dual-signature Ed25519 authorization for re-evaluation grade amendments before committing ledger revisions.
5. **Security Operations & Forensic Tamper Console (`/audit`):**
   - Continuous daemon that scans live database rows against the immutable Merkle Root.
   - Features the **Evaluator Break-Test Sandbox** for live judge SQL injection testing.

---

## 🚀 Quickstart & One-Click Launch

### Prerequisites:
- Python 3.10+
- Node.js 18+ & npm

### Launch Both Servers (One Click):
**On Windows:** Double-click `start_verimark.bat` or run:
```powershell
.\start_verimark.ps1
```

**Or Manual Startup:**
- **Terminal 1 (Backend API):**
  ```bash
  cd backend
  uvicorn app.main:app --reload --port 8000
  ```
- **Terminal 2 (Frontend UI):**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

Open your browser at:
- **Web Portal:** `http://localhost:5173` (or `http://localhost:5174`)
- **Interactive Swagger Docs:** `http://localhost:8000/docs`

---

## 🧪 Evaluator Break-Test Suite & Live CLI Console

### 1. Interactive Evaluator Console (The Live Demo Tool)
Double-click `run_evaluator_console.bat` or run:
```bash
cd backend
python tests/evaluator_cli.py
```
Provides an interactive menu for judges to fire live attacks:
- `[1]` Ingest 1,500 students & measure latency.
- `[2]` Direct SQL Tamper Attack (`UPDATE subject_marks SET marks_obtained = 99`) $\to$ triggers red siren and pinpoints tampered student.
- `[3]` Dual-Key Ed25519 Governance Legitimate Amendment.
- `[4]` Adversarial Forged QR Code Bit-Flip Verification.

### 2. Automated Adversarial Gauntlet
Double-click `run_adversarial_tests.bat` or run:
```bash
cd backend
python -m pytest tests/test_adversarial_suite.py -v
```

---

## 🌐 Deploying on Vercel (1-Click Ready)

The repository is pre-configured with both root `vercel.json` and `frontend/vercel.json` for zero-configuration deployment:

### Steps:
1. Push your repository to GitHub: `Rahul-0525/TamperProofMarksheet` (`main` branch).
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import `TamperProofMarksheet`.
4. In Project Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** Select `frontend` (or leave as root, since root `vercel.json` directs the build to `frontend/dist`).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. Vercel will build and assign an active HTTPS URL in $< 50$ seconds. Client-side routing is handled through rewrite rules, preventing 404 errors on browser page reloads.

---

## 📂 Project Directory Structure

```text
TamperProofMarksheet/
├── backend/
│   ├── app/
│   │   ├── api/                   # REST routes (admin, results, governance, audit)
│   │   ├── crypto/                # Merkle tree engine & Ed25519 signatures
│   │   ├── db/                    # SQLAlchemy database models & session
│   │   └── main.py                # FastAPI entrypoint with CORS
│   └── tests/
│       ├── test_api.py            # API integration tests
│       ├── test_crypto.py         # Merkle tree & signature unit tests
│       ├── test_performance.py   # 1,500-student latency benchmarks
│       ├── test_adversarial_suite.py # 6-point evaluator break-test gauntlet
│       └── evaluator_cli.py       # Live interactive demo console
├── frontend/
│   ├── public/                    # Static assets & background wallpaper
│   ├── src/
│   │   ├── assets/                # Misty pine panoramic wallpaper
│   │   ├── components/            # Navbar, FluidBackground, LpuLogo, ProofPathVisualizer
│   │   ├── pages/                 # Home, Marksheet, Verify, Governance, Audit, Admin
│   │   ├── services/api.ts        # Axios client with offline fallback
│   │   └── utils/                 # Web Crypto Merkle verifier & useScrollObserver
│   ├── package.json
│   └── vercel.json                # Frontend SPA rewrite rules
├── docs/                          # Comprehensive architecture and evaluator guides
├── vercel.json                    # Root Monorepo deployment configuration
├── README.md                      # Primary project documentation
└── AI_DISCLOSURE.md               # Official hackathon AI declaration
```
