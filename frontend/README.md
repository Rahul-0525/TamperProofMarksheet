# 🎨 VeriMark Frontend Portal (`feature/frontend-ui`)

Production-ready web application for **VeriMark (Problem H8: Tamper-Proof Exam Result Ledger)**, built with **React (Vite) + TypeScript + Tailwind CSS**.

---

## 🚀 Recent Updates & Backend Compatibility (Merged from `main`)

This branch has been synced and merged with the latest changes from `main` (`77af7c3`), integrating with the backend implemented by Abhinav Prakash and reviewed by Rahul.

### Integration Summary:
| Service / Page | Route | Backend API Endpoint | Compatibility & Fallback Mode |
| :--- | :--- | :--- | :--- |
| **Marksheet View** | `/marksheet/:roll_no` | `GET /api/results/{roll_no}` | Loads student details and live `root_hash` from DB. Dynamic QR code encodes `CompactQRPayload`. Fallback: Built-in 4-student cohort mock data. |
| **Public Verification** | `/verify` | `GET /api/results/{roll_no}/proof`<br>`POST /api/results/verify` | **100% Client-Side Web Crypto Engine**: Computes SHA-256 leaf hash from canonical string, traverses Merkle audit path, and verifies root offline or calls online API. |
| **Dual Governance** | `/governance` | `GET /api/governance/corrections`<br>`POST /api/governance/propose-correction`<br>`POST /api/governance/sign-correction` | Allows proposing new amendments and co-signing as **Dean** or **Controller** with Ed25519 digital signatures. Transitions: `Awaiting (0/2)` → `1/2 Signed` → `Approved & Committed`. |
| **Tamper Audit Dashboard** | `/audit` | `GET /api/audit/integrity-check`<br>`POST /api/audit/simulate-tamper` | Triggers the daemon to audit raw SQL rows against the immutable ledger root. Includes live **"Attack Simulator"** (`UPDATE results SET marks = 99`) for judge evaluations. |

---

## 🛠️ Developer Setup & Commands

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies (Node.js 18+ required)
npm install

# 3. Start development server
npm run dev
# Running on http://localhost:5173

# 4. Production build & TypeScript check
npm run build
```

---

## 🌐 Environment Configuration

In `.env` or Vercel environment variables:
```env
VITE_API_URL=http://localhost:8000/api
```
*(Defaults automatically to `http://localhost:8000/api` if omitted).*

---

## 📦 Vercel Deployment

Configured for 1-click zero-config deployment on Vercel:
- Root directory: `frontend`
- SPA client routing rules: `vercel.json` (`[{"source": "/(.*)", "destination": "/index.html"}]`)
- Zero 404 routing errors on direct URL access or refresh.
