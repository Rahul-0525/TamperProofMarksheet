# 🌲 TruGrade Frontend Portal (`frontend`)

Production-ready, luxury architectural web application for **TruGrade (Problem H8: Tamper-Proof Exam Result Ledger)** at **Lovely Professional University (LPU)**, built with **React (Vite) + TypeScript + Tailwind CSS**.

---

## 🏛️ TruGrade UI Architecture & Institutional Experience

1. **Student & Public Credential Portal (`/` and `/marksheet/:roll_no`):**
   - High-contrast transcript search designed around Dribbble luxury architectural aesthetics with daylight-illuminated misty pine forest wallpaper.
   - Animated flowing color gradient headline on the public ledger.
   - Formal university transcript formatted with `@media print` single-page pagination and high-density cryptographic verification QR code.
   - Built-in 4-student cohort with instant sample pills (`2024CS001` through `2024CS004`).

2. **Public QR Verification Portal (`/verify`):**
   - **Hardware-Aware Camera Engine:**
     - **Mobile Phones:** Automatically invokes the **rear camera** (`{ facingMode: "environment" }`) for pointing directly at printed marksheets.
     - **Laptops / Desktops:** Uses the front webcam with **horizontal mirroring** (`scaleX(-1)`) so motion and marksheets feel natural like a real mirror.
     - Includes manual toggle buttons to mirror/unmirror or switch between front and back lenses on the fly.
   - **100% Offline Client-Side Web Crypto Engine:** Traverses the Merkle audit path directly inside the browser using native `SubtleCrypto.digest('SHA-256')`.
   - Visual inclusion proof tree with interactive node breakdown.

3. **Executive Governance Chamber (`/governance`):**
   - Dual-Key Ed25519 digital signature desk for the **Dean of Academic Affairs** and **Controller of Examinations**.
   - Propose, review, and co-sign grade amendments with complete separation of institutional duties.

4. **Forensic Database Tamper Console (`/audit`):**
   - Real-time audit daemon comparing live SQL rows against the immutable Merkle Root.
   - Interactive **Evaluator Attack Sandbox** to simulate an unauthorized SQL injection (`UPDATE subject_marks SET marks_obtained = 99`) and observe instant row-level pinpointing.

5. **Office of the Registrar (`/admin`):**
   - Bulk CSV ingestion terminal computing balanced Merkle tree leaf hashes in $< 1.4$ seconds.

---

## 🎨 Design System & Palette

Crafted according to the muted forest green palette with warm amber highlights:

| Token | Hex Value | Usage |
|---|---|---|
| `forest.950` | `#0a0f09` | Deepest forest shadow, text base |
| `forest.800` | `#1f2f22` | Deep spruce tone, card border foundations |
| `forest.500` | `#3e5640` | Muted evergreen moss, card hover outlines |
| `forest.200` | `#94a789` | Soft meadow sage foliage, badges, gradient wave |
| `slateFog.500` | `#7a94a1` | Mountain mist slate fog, secondary labels |
| `slateFog.200` | `#ced9df` | Ethereal cloud mist white, high-contrast text |
| `warmAmber` | `#fbbf24`, `#f59e0b` | Institutional university crest, seals, star ratings |

- **Universal Scroll Fly-in Animations:** Powered by `IntersectionObserver` and `MutationObserver` in `useScrollObserver.ts` for buttery-smooth entrance transitions across all viewports.
- **Atmospheric Background Motion:** Slow Ken Burns breathing drift and dual rolling mist waves.

---

## 🛠️ Developer Setup & Commands

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (Node.js 18+ required)
npm install

# 3. Start local development server
npm run dev
# Active on http://localhost:5173

# 4. Production build & TypeScript check
npm run build
```

---

## 🌐 Environment Configuration

In `.env` or Vercel Environment Variables:
```env
VITE_API_URL=http://localhost:8000/api
```
*(Defaults gracefully to `http://localhost:8000/api` if omitted).*

---

## 📦 Deploying on Vercel

TruGrade is pre-configured for instant zero-configuration deployment on **Vercel**:

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your code to GitHub (`main` branch).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository: `Rahul-0525/TamperProofMarksheet`.
4. Under **Project Settings**:
   - **Framework Preset:** Vite
   - **Root Directory:** Click `Edit` and select `frontend` (or leave as root since `vercel.json` handles monorepo routing).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**. Your site will be live on a `*.vercel.app` domain in ~45 seconds!

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI if needed
npm install -g vercel

# From the repository root
vercel

# Follow prompts: Select default scope, link project, and deploy!
```
Client-side SPA routes (`/`, `/marksheet/:roll_no`, `/verify`, `/governance`, `/audit`, `/admin`) are routed through `index.html` via `vercel.json` without any 404 errors on browser refresh.
