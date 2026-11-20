"""
VeriMark — Interactive Evaluator Break-Test Console (CLI)
Designed for live hackathon demonstrations with judges.
Execute attacks, stress tests, and cryptographic proofs with live telemetry.
"""

import os
import sys
import time
import io
import csv
import hashlib
from typing import Optional

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from fastapi.testclient import TestClient
from app.main import app
from app.crypto.signatures import generate_keypair, sign_message

client = TestClient(app)

# ANSI Colors
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"


def print_banner():
    print(f"\n{CYAN}{'='*72}{RESET}")
    print(f"{BOLD}🎓 VeriMark (H8) — Evaluator Break-Test Console & Live Attack Suite{RESET}")
    print(f"{CYAN}{'='*72}{RESET}")
    print(f"Target: Problem H8 — Tamper-Proof Exam Result Ledger (Code Fuzion 2026)")
    print(f"{CYAN}{'-'*72}{RESET}\n")


def action_bulk_stress():
    print(f"{YELLOW}▶ [TEST 1] Ingesting 1,500 students (6,000 course rows)...{RESET}")
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=[
        "roll_no", "student_name", "course", "semester", "academic_year",
        "subject_code", "subject_name", "marks_obtained", "max_marks", "grade"
    ])
    writer.writeheader()

    subjects = [
        ("CS501", "Operating Systems", 85, "A"),
        ("CS502", "Database Management Systems", 92, "A+"),
        ("CS503", "Computer Networks", 78, "B+"),
        ("CS504", "Theory of Computation", 88, "A")
    ]

    for i in range(1, 1501):
        roll = f"2024EVAL{i:05d}"
        for code, name, mark, grade in subjects:
            writer.writerow({
                "roll_no": roll,
                "student_name": f"Student {i}",
                "course": "B.Tech CSE",
                "semester": "5",
                "academic_year": "2025-2026",
                "subject_code": code,
                "subject_name": name,
                "marks_obtained": str(mark),
                "max_marks": "100",
                "grade": grade
            })

    csv_bytes = output.getvalue().encode("utf-8")
    t0 = time.perf_counter()
    res = client.post("/api/admin/publish-batch", files={"file": ("eval_1500.csv", io.BytesIO(csv_bytes), "text/csv")})
    elapsed = time.perf_counter() - t0

    if res.status_code == 201:
        data = res.json()
        print(f"{GREEN}✓ Batch Published Successfully!{RESET}")
        print(f"  • Total Students Hashed: {BOLD}{data['total_students']}{RESET}")
        print(f"  • Minted Merkle Root:    {CYAN}{data['root_hash']}{RESET}")
        print(f"  • Processing Time:       {BOLD}{elapsed:.3f} seconds{RESET} (Benchmark: < 2.0s)")
    else:
        print(f"{RED}✗ Ingestion Failed: {res.text}{RESET}")


def action_tamper_attack():
    target_roll = "2024EVAL00042"
    target_sub = "CS502"
    tampered_mark = 99.0

    print(f"{YELLOW}▶ [TEST 2] Simulating Direct SQL Tampering on {target_roll} ({target_sub})...{RESET}")
    print(f"  Executing raw SQL: UPDATE subject_marks SET marks_obtained = 99 WHERE roll = '{target_roll}'")

    res = client.post("/api/audit/simulate-tamper", json={
        "roll_no": target_roll,
        "subject_code": target_sub,
        "tampered_marks": tampered_mark
    })

    if res.status_code == 200:
        print(f"{RED}⚠ SQL Mutation Executed! (Bypassed web app and governance){RESET}")
        print(f"\n{YELLOW}▶ Running Continuous Tamper Audit Daemon...{RESET}")
        t0 = time.perf_counter()
        audit_res = client.get("/api/audit/integrity-check")
        elapsed_ms = (time.perf_counter() - t0) * 1000.0

        audit = audit_res.json()
        if audit["status"] == "COMPROMISED":
            print(f"{RED}{BOLD}🚨 CRITICAL ALARM: DIRECT DB TAMPERING DETECTED!{RESET}")
            print(f"  • Audit Scan Time: {elapsed_ms:.2f} ms")
            print(f"  • Active Ledger Root:      {audit['active_ledger_root'][:16]}...")
            print(f"  • Recomputed Database Root: {audit['recomputed_db_root'][:16]}... (MISMATCH)")
            print(f"\n{RED}Identified Discrepancy:{RESET}")
            for item in audit["tampered_records"]:
                print(f"  • Roll No: {BOLD}{item['roll_no']}{RESET} | Student: {item['student_name']}")
                print(f"    Issue:   {item['issue']}")
        else:
            print(f"{RED}✗ Failed to catch tampering!{RESET}")
    else:
        print(f"{RED}✗ Injection failed: {res.text}{RESET}")


def action_dual_sign_defense():
    print(f"{YELLOW}▶ [TEST 3] Legitimate Re-evaluation via Dual-Key Ed25519 Governance...{RESET}")
    target_roll = "2024EVAL00050"
    target_sub = "CS501"

    # Step 1: Propose
    res = client.post("/api/governance/propose-correction", json={
        "roll_no": target_roll,
        "subject_code": target_sub,
        "new_marks": 95.0,
        "reason": "Official scrutiny committee recalculation",
        "proposed_by": "Prof. R. K. Verma"
    })
    corr_id = res.json()["correction_id"]
    print(f"  1. Proposal created: {corr_id} (Status: AWAITING_APPROVALS)")

    # Step 2: Dean Signs
    dean_priv, dean_pub = generate_keypair()
    dean_sig = sign_message(f"{corr_id}:DEAN", dean_priv)
    res_dean = client.post("/api/governance/sign-correction", json={
        "correction_id": corr_id,
        "signer_role": "DEAN",
        "signature": dean_sig,
        "public_key": dean_pub
    })
    print(f"  2. Dean of Academics signed. Status: {res_dean.json()['status']} (Single-admin commit blocked)")

    # Step 3: Controller Signs
    ctrl_priv, ctrl_pub = generate_keypair()
    ctrl_sig = sign_message(f"{corr_id}:CONTROLLER", ctrl_priv)
    res_ctrl = client.post("/api/governance/sign-correction", json={
        "correction_id": corr_id,
        "signer_role": "CONTROLLER",
        "signature": ctrl_sig,
        "public_key": ctrl_pub
    })
    ctrl_data = res_ctrl.json()
    print(f"{GREEN}✓ Controller of Examinations signed.{RESET}")
    print(f"  Status: {BOLD}{ctrl_data['status']}{RESET} | Both Signatures Verified: {ctrl_data['both_signed']}")
    print(f"  New Immutable Ledger Root Minted: {CYAN}{ctrl_data['new_root_hash']}{RESET}")


def action_qr_forgery_test():
    print(f"{YELLOW}▶ [TEST 4] Adversarial Forged QR Code / Bit-Flip Test...{RESET}")
    res = client.get("/api/results/2024EVAL00001/proof")
    proof = res.json()

    # Create tampered payload
    corrupted_leaf = proof["leaf_hash"][:-1] + ("0" if proof["leaf_hash"][-1] != "0" else "1")

    res_verify = client.post("/api/results/verify", json={
        "leaf_hash": corrupted_leaf,
        "root_hash": proof["root_hash"],
        "audit_path": proof["audit_path"]
    })

    verified = res_verify.json()["verified"]
    if not verified:
        print(f"{GREEN}✓ Cryptographic Shield Active!{RESET}")
        print(f"  Tampered QR Payload correctly REJECTED by Merkle verification engine.")
    else:
        print(f"{RED}✗ Forgery accepted!{RESET}")


def main_menu():
    print_banner()
    while True:
        print(f"{BOLD}Choose an Evaluator Test to Run:{RESET}")
        print("  [1] Bulk Ingestion & Stress Test (1,500 students)")
        print("  [2] Direct SQL Tamper Attack & Detection Daemon (The Judge Break-Test)")
        print("  [3] Dual-Key Ed25519 Governance Legitimate Amendment")
        print("  [4] Adversarial Forged QR Code Verification")
        print("  [5] Run Full Pytest Adversarial Gauntlet")
        print("  [0] Exit")

        choice = input(f"\n{CYAN}Select option (0-5): {RESET}").strip()
        print()

        if choice == "1":
            action_bulk_stress()
        elif choice == "2":
            action_tamper_attack()
        elif choice == "3":
            action_dual_sign_defense()
        elif choice == "4":
            action_qr_forgery_test()
        elif choice == "5":
            os.system("pytest tests/test_adversarial_suite.py -v")
        elif choice == "0":
            print("Exiting Evaluator Console. Good luck in Code Fuzion 2026!")
            break
        else:
            print(f"{RED}Invalid option, try again.{RESET}")
        print(f"\n{CYAN}{'-'*72}{RESET}\n")


if __name__ == "__main__":
    main_menu()
