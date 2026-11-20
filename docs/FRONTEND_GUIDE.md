# 🎨 TruGrade Frontend Guide (`frontend`)
**Code Fuzion 2026 — Problem H8: Tamper-Proof Exam Result Ledger**  
*Engineered for Lovely Professional University (LPU)*

---

## 🏛️ Real-World Multi-Portal Architecture & Separation of Roles

To satisfy the hackathon criterion **"Usability and design (10%): Works for the real user named in the problem"**, TruGrade cleanly separates the user experience into dedicated, role-isolated portals:

1. **Student & Public Credential Portal (`/` and `/marksheet/:roll_no`):**
   - **User:** Students, parents, general public.
   - **Features:** Clean search box for roll numbers, formal printable transcript (`@media print` formatted for clean single-page paper output), and high-density cryptographic verification QR code.
   - **Security:** Zero access to admin actions, no database tampering tools, and no signature panels.

2. **Third-Party Verification Portal (`/verify`):**
   - **User:** Background verification agencies, corporate recruiters (e.g. Google, TCS, Infosys HR), and foreign universities.
   - **Features:** 
     - Automatic smartphone rear-camera invocation (`facingMode: "environment"`).
     - Mirrored laptop webcam feed (`scaleX(-1)`) with mirror & camera flip controls.
     - Calculates the SHA-256 leaf and climbs the Merkle audit path to verify against the published root hash.
   - **Key Evaluator Metric:** Works **100% offline in airplane mode** via the native browser Web Crypto API!

3. **Executive Governance Chamber (`/governance`):**
   - **User:** University Leadership — **Dean of Academic Affairs** and **Controller of Examinations**.
   - **Features:** Strict multi-signature governance docket. To prevent bribery or single-clerk manipulation, mark amendments require two independent Ed25519 digital cryptographic signatures before the database allows an update and mints a new ledger root.

4. **Security Operations & Forensic Auditor Console (`/audit`):**
   - **User:** University Vigilance Officers & **Hackathon Judges**.
   - **Features:** Real-time continuous audit daemon that scans all SQL records against the immutable Merkle Root. Includes the **Evaluator Break-Test Sandbox** where judges can inject direct SQL mutations (`UPDATE subject_marks SET marks_obtained = 99`) and immediately watch the daemon sound the alarm and pinpoint the exact modified roll number and subject.

5. **Office of the Registrar (`/admin`):**
   - **User:** Examination Branch Registrar.
   - **Features:** Bulk CSV ingestion (`results_sample.csv`) that computes 1,500+ Merkle leaf hashes in $< 1.4$ seconds and publishes the batch.

---

## 🎨 Visual Design System & Animations

- **Muted Forest Green Palette:** `#0a0f09` (Base Forest Black), `#1f2f22` (Deep Spruce), `#3e5640` (Muted Moss), `#94a789` (Meadow Sage), `#7a94a1` (Misty Slate Fog), and `#ced9df` (Mist White).
- **Photographic Scenic Wallpaper:** High-resolution misty pine forest wallpaper with soft morning daylight and an architectural cabin with warm glowing windows.
- **Ambient Motion:** Slow Ken Burns breathing drift and dual counter-drifting mist fog waves.
- **Universal Scroll Fly-in Animations:** Powered by `IntersectionObserver` and `MutationObserver` in `useScrollObserver.ts` across all devices.
- **Responsive Navigation:** Touch-friendly mobile drawer menu on small screens and sliding capsule pill on desktop.

---

## 📦 Vercel Deployment Configuration

Pre-configured with `vercel.json` for 1-click zero-config deployment:
- Single Page Application (SPA) client rewrite rules (`[{"source": "/(.*)", "destination": "/index.html"}]`) prevent 404 errors on browser page reloads.
- Can be deployed directly from the repository root or by selecting `frontend` as the root directory.
