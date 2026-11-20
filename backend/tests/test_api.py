import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from app.main import app
from app.crypto.signatures import generate_keypair, sign_message
from app.db.database import Base, engine

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    # Ensure fresh tables for test run
    Base.metadata.create_all(bind=engine)
    yield



def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "operational"


def test_publish_batch_and_results_flow():
    # 1. Publish batch from sample_data/results_sample.csv
    csv_path = os.path.join(repo_root, "sample_data", "results_sample.csv")
    with open(csv_path, "rb") as f:
        response = client.post(
            "/api/admin/publish-batch",
            files={"file": ("results_sample.csv", f, "text/csv")}
        )
    assert response.status_code == 201
    batch_data = response.json()
    assert "batch_id" in batch_data
    assert batch_data["total_students"] == 55
    assert len(batch_data["root_hash"]) == 64
    root_hash = batch_data["root_hash"]

    # 2. Get marksheet for 2024CS001
    roll_no = "2024CS001"
    res_student = client.get(f"/api/results/{roll_no}")
    assert res_student.status_code == 200
    student_data = res_student.json()
    assert student_data["roll_no"] == roll_no
    assert len(student_data["subjects"]) == 4
    assert student_data["root_hash"] == root_hash
    leaf_hash = student_data["leaf_hash"]

    # 3. Get inclusion proof for 2024CS001
    res_proof = client.get(f"/api/results/{roll_no}/proof")
    assert res_proof.status_code == 200
    proof_data = res_proof.json()
    assert proof_data["roll_no"] == roll_no
    assert proof_data["leaf_hash"] == leaf_hash
    assert proof_data["root_hash"] == root_hash
    assert proof_data["is_valid"] is True
    assert len(proof_data["audit_path"]) > 0

    # 4. Verify proof via /api/results/verify
    res_verify = client.post(
        "/api/results/verify",
        json={
            "leaf_hash": leaf_hash,
            "root_hash": root_hash,
            "audit_path": proof_data["audit_path"]
        }
    )
    assert res_verify.status_code == 200
    verify_result = res_verify.json()
    assert verify_result["verified"] is True
    assert verify_result["calculated_root"] == root_hash

    # 5. Check integrity check initially returns SECURE
    res_audit = client.get("/api/audit/integrity-check")
    assert res_audit.status_code == 200
    audit_data = res_audit.json()
    assert audit_data["status"] == "SECURE"
    assert len(audit_data["tampered_records"]) == 0
    assert audit_data["active_ledger_root"] == root_hash


def test_dual_approval_governance():
    roll_no = "2024CS002"
    subject_code = "CS501"

    # 1. Propose correction
    prop_res = client.post(
        "/api/governance/propose-correction",
        json={
            "roll_no": roll_no,
            "subject_code": subject_code,
            "new_marks": 99.0,
            "reason": "Re-evaluation discrepancy cleared by Examination Board",
            "proposed_by": "Prof. Sharma"
        }
    )
    assert prop_res.status_code == 201
    prop_data = prop_res.json()
    correction_id = prop_data["correction_id"]
    assert prop_data["status"] == "AWAITING_APPROVALS"

    # 2. Generate Dean and Controller Ed25519 keypairs
    dean_priv, dean_pub = generate_keypair()
    ctrl_priv, ctrl_pub = generate_keypair()

    dean_msg = f"Approve {correction_id}"
    dean_sig = sign_message(dean_msg, dean_priv)

    # 3. Dean signs
    dean_res = client.post(
        "/api/governance/sign-correction",
        json={
            "correction_id": correction_id,
            "signer_role": "DEAN",
            "signature": dean_sig,
            "public_key": dean_pub
        }
    )
    assert dean_res.status_code == 200
    assert dean_res.json()["status"] == "AWAITING_SECOND_APPROVAL"
    assert dean_res.json()["both_signed"] is False

    # 4. Controller signs
    ctrl_msg = f"{correction_id}:CONTROLLER"
    ctrl_sig = sign_message(ctrl_msg, ctrl_priv)

    ctrl_res = client.post(
        "/api/governance/sign-correction",
        json={
            "correction_id": correction_id,
            "signer_role": "CONTROLLER",
            "signature": ctrl_sig,
            "public_key": ctrl_pub
        }
    )
    assert ctrl_res.status_code == 200
    assert ctrl_res.json()["status"] == "APPROVED"
    assert ctrl_res.json()["both_signed"] is True
    new_root = ctrl_res.json()["new_root_hash"]
    assert new_root is not None

    # 5. Verify student mark in DB updated to 99
    student_res = client.get(f"/api/results/{roll_no}")
    assert student_res.status_code == 200
    student_data = student_res.json()
    updated_sub = next(s for s in student_data["subjects"] if s["subject_code"] == subject_code)
    assert updated_sub["marks_obtained"] == 99.0
    assert student_data["root_hash"] == new_root

    # 6. Verify audit returns SECURE with new ledger root
    res_audit = client.get("/api/audit/integrity-check")
    assert res_audit.status_code == 200
    assert res_audit.json()["status"] == "SECURE"
    assert res_audit.json()["active_ledger_root"] == new_root


def test_tamper_detection_pinpointing():
    roll_no = "2024CS003"
    subject_code = "CS502"

    # Simulate direct SQL tampering (bypassing governance)
    tamper_res = client.post(
        "/api/audit/simulate-tamper",
        json={
            "roll_no": roll_no,
            "subject_code": subject_code,
            "tampered_marks": 99.0
        }
    )
    assert tamper_res.status_code == 200

    # Call audit integrity check
    audit_res = client.get("/api/audit/integrity-check")
    assert audit_res.status_code == 200
    audit_data = audit_res.json()
    assert audit_data["status"] == "COMPROMISED"
    assert len(audit_data["tampered_records"]) > 0

    # Pinpoint exact student and altered subject
    tampered_entry = next((t for t in audit_data["tampered_records"] if t["roll_no"] == roll_no), None)
    assert tampered_entry is not None
    assert subject_code in tampered_entry["issue"]
