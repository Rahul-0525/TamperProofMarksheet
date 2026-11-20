# 🚀 Team Laptop Setup & Git Collaboration Guide

Welcome to the team! We are building **VeriMark (Code Fuzion 2026 - Problem H8: Tamper-Proof Exam Result Ledger)**.
Follow this guide to get the repository onto your laptop, configure your branch, and start working independently without merge conflicts.

---

## 1. Laptop Requirements
- **Git** installed ([git-scm.com](https://git-scm.com/))
- **Python 3.10+** (for Backend teammate)
- **Node.js 18+ & npm** (for Frontend teammate)
- Your AI Code Assistant (Google Antigravity, Cursor, VS Code with Copilot/Claude, etc.)

---

## 2. Step-by-Step Setup (Run in your Terminal)

### Step 1: Clone the Repository
Open your terminal (PowerShell, Command Prompt, or Bash) and run:
```bash
git clone https://github.com/Rahul-0525/TamperProofMarksheet.git
cd TamperProofMarksheet
```

### Step 2: Create and Switch to Your Dedicated Branch
Do **NOT** work directly on `main`. Each team member has a dedicated feature branch:

- **If you are the Backend Engineer:**
  ```bash
  git checkout -b feature/backend-api
  ```
- **If you are the Frontend Engineer:**
  ```bash
  git checkout -b feature/frontend-ui
  ```

Verify you are on your branch by running:
```bash
git branch
```
*(The active branch will have an asterisk `*` next to it)*

---

## 3. How to Work with Your AI Assistant

Once you open the project folder in your IDE:
1. Open the guide specific to your role:
   - Backend: [`docs/BACKEND_GUIDE.md`](./BACKEND_GUIDE.md)
   - Frontend: [`docs/FRONTEND_GUIDE.md`](./FRONTEND_GUIDE.md)
2. Copy the **AI Agent System Prompt** from that guide and paste it into your AI assistant.
3. Your AI agent has been specifically instructed to:
   - Guide you through every terminal command step-by-step.
   - Explain how each piece of code works so you are 100% prepared for the judges' viva.
   - Help you make clean, granular git commits.

---

## 4. Git Rules for High Hackathon Marks (15% Viva & Git Score)

The judges explicitly check for **clean, granular commit histories**. Avoid doing one massive commit at the end.

### How to commit as you build:
Whenever you finish a specific feature (e.g. creating the DB model, or building the QR scanner):
```bash
git status
git add .
git commit -m "feat(backend): add database models for students and ledger"
git push -u origin <your-branch-name>
```

### Pulling Updates from Lead (Rahul):
If Rahul updates the shared contracts or crypto engine on `main`:
```bash
git fetch origin
git merge origin/main
```

---

## 5. Submitting Your Work for Integration
When your module is working and tested:
1. Ensure all changes are committed and pushed:
   ```bash
   git push origin <your-branch-name>
   ```
2. Message Rahul on WhatsApp/Discord:
   > *"Hey Rahul, I've pushed the latest work on `feature/backend-api` (or `feature/frontend-ui`). Ready for integration testing!"*
3. Rahul will review, test integration, and merge into `main`.
