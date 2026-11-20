"""
VeriMark — Backend Data Models & Canonical Hashing Contract
Single Source of Truth for Pydantic Models & SHA-256 Hashing Formula
"""

import hashlib
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class SubjectMark(BaseModel):
    subject_code: str
    subject_name: str
    marks_obtained: float
    max_marks: float = 100.0
    grade: str


class StudentResultModel(BaseModel):
    roll_no: str
    student_name: str
    course: str
    semester: int
    academic_year: str
    subjects: List[SubjectMark]
    total_marks: float
    max_total: float
    gpa: float
    result_status: Literal["PASS", "FAIL", "WITHHELD"]
    salt: str
    leaf_hash: Optional[str] = None


def compute_canonical_string(student: StudentResultModel) -> str:
    """
    Computes deterministic canonical representation of a student record.
    Subjects are sorted alphabetically by subject_code to guarantee determinism.
    Format:
    roll_no|student_name|course|semester|sorted_subjects|total_marks|max_total|gpa|result_status|salt
    """
    sorted_subjects = sorted(student.subjects, key=lambda s: s.subject_code)
    subjects_repr = ";".join(
        f"{s.subject_code}:{s.marks_obtained:g}:{s.max_marks:g}" for s in sorted_subjects
    )
    
    parts = [
        student.roll_no.strip(),
        student.student_name.strip(),
        student.course.strip(),
        str(student.semester),
        subjects_repr,
        f"{student.total_marks:g}",
        f"{student.max_total:g}",
        f"{student.gpa:.2f}",
        student.result_status.strip().upper(),
        student.salt.strip()
    ]
    return "|".join(parts)


def compute_leaf_hash(student: StudentResultModel) -> str:
    """
    Calculates SHA-256 hash of canonical string representation.
    """
    canonical_str = compute_canonical_string(student)
    return hashlib.sha256(canonical_str.encode("utf-8")).hexdigest().lower()


class MerkleProofStep(BaseModel):
    position: Literal["left", "right"]
    hash: str


class MerkleProofResponse(BaseModel):
    roll_no: str
    leaf_hash: str
    leaf_index: int
    root_hash: str
    published_at: str
    audit_path: List[MerkleProofStep]
    is_valid: bool


class CorrectionProposalRequest(BaseModel):
    roll_no: str
    subject_code: str
    new_marks: float
    reason: str
    proposed_by: str


class SignCorrectionRequest(BaseModel):
    correction_id: str
    signer_role: Literal["DEAN", "CONTROLLER"]
    signature: str  # Hex-encoded Ed25519 signature
    public_key: str  # Hex-encoded Ed25519 public key


class TamperReport(BaseModel):
    roll_no: str
    student_name: str
    issue: str


class IntegrityCheckResponse(BaseModel):
    status: Literal["SECURE", "COMPROMISED"]
    checked_at: str
    total_records: int = 0
    active_ledger_root: str
    recomputed_db_root: str
    tampered_records: List[TamperReport] = []
