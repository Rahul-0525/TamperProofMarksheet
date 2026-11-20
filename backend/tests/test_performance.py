import os
import sys
import time
import io
import csv
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from app.main import app

client = TestClient(app)


def test_bulk_1500_students_ingestion_and_proof_latency():
    # 1. Generate in-memory CSV with 1,500 students (4 subjects each = 6,000 rows)
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=[
        "roll_no", "student_name", "course", "semester", "academic_year",
        "subject_code", "subject_name", "marks_obtained", "max_marks", "grade"
    ])
    writer.writeheader()

    subjects = [
        ("CS501", "Operating Systems"),
        ("CS502", "Database Management Systems"),
        ("CS503", "Computer Networks"),
        ("CS504", "Theory of Computation")
    ]

    for i in range(1, 1501):
        roll = f"2024TEST{i:05d}"
        for code, name in subjects:
            writer.writerow({
                "roll_no": roll,
                "student_name": f"Student {i}",
                "course": "B.Tech CSE",
                "semester": "5",
                "academic_year": "2025-2026",
                "subject_code": code,
                "subject_name": name,
                "marks_obtained": "85",
                "max_marks": "100",
                "grade": "A"
            })

    csv_bytes = output.getvalue().encode("utf-8")

    # 2. Benchmark Bulk Ingestion Latency (< 2.0s target)
    start_time = time.perf_counter()
    response = client.post(
        "/api/admin/publish-batch",
        files={"file": ("bulk_test.csv", io.BytesIO(csv_bytes), "text/csv")}
    )
    elapsed_publish = time.perf_counter() - start_time
    assert response.status_code == 201
    batch_data = response.json()
    assert batch_data["total_students"] == 1500
    print(f"\n[BENCHMARK] 1,500 students bulk publish latency: {elapsed_publish:.3f}s (Target: < 2.0s)")
    assert elapsed_publish < 2.0, f"Bulk ingestion took {elapsed_publish:.3f}s, expected < 2.0s"

    # 3. Benchmark Proof Generation Latency (< 50ms target)
    target_roll = "2024TEST00750"
    start_proof = time.perf_counter()
    proof_res = client.get(f"/api/results/{target_roll}/proof")
    elapsed_proof = (time.perf_counter() - start_proof) * 1000.0  # in ms
    assert proof_res.status_code == 200
    proof_data = proof_res.json()
    assert proof_data["is_valid"] is True
    print(f"[BENCHMARK] Merkle proof generation latency: {elapsed_proof:.2f}ms (Target: < 50ms)")
    assert elapsed_proof < 50.0, f"Proof generation took {elapsed_proof:.2f}ms, expected < 50ms"

    # 4. Benchmark Proof Verification Latency (< 50ms target)
    start_verify = time.perf_counter()
    verify_res = client.post(
        "/api/results/verify",
        json={
            "leaf_hash": proof_data["leaf_hash"],
            "root_hash": proof_data["root_hash"],
            "audit_path": proof_data["audit_path"]
        }
    )
    elapsed_verify = (time.perf_counter() - start_verify) * 1000.0  # in ms
    assert verify_res.status_code == 200
    assert verify_res.json()["verified"] is True
    print(f"[BENCHMARK] Proof verification latency: {elapsed_verify:.2f}ms (Target: < 50ms)")
    assert elapsed_verify < 50.0, f"Proof verification took {elapsed_verify:.2f}ms, expected < 50ms"
