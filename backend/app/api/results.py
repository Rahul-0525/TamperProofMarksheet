from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Student, SubjectMark, LedgerHead
from app.crypto.merkle import MerkleTree, verify_merkle_proof, hash_pair
from contracts.models import MerkleProofResponse, MerkleProofStep

router = APIRouter(prefix="/results", tags=["Results & Verification"])


class VerifyRequest(BaseModel):
    leaf_hash: str
    root_hash: str
    audit_path: List[MerkleProofStep]


class VerifyResponse(BaseModel):
    verified: bool
    calculated_root: str
    expected_root: str


@router.get("/{roll_no}")
def get_student_result(roll_no: str, db: Session = Depends(get_db)):
    """
    Returns student marksheet details, computed leaf_hash, and the active published root_hash.
    """
    student = db.query(Student).filter(Student.roll_no == roll_no, Student.is_active == True).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with roll number '{roll_no}' not found in active ledger."
        )

    active_ledger = db.query(LedgerHead).filter(LedgerHead.is_active == True).order_by(LedgerHead.id.desc()).first()
    root_hash = active_ledger.root_hash if active_ledger else ""

    subjects = [
        {
            "subject_code": s.subject_code,
            "subject_name": s.subject_name,
            "marks_obtained": s.marks_obtained,
            "max_marks": s.max_marks,
            "grade": s.grade
        }
        for s in student.subjects
    ]

    return {
        "roll_no": student.roll_no,
        "student_name": student.student_name,
        "course": student.course,
        "semester": student.semester,
        "academic_year": student.academic_year,
        "subjects": subjects,
        "total_marks": student.total_marks,
        "max_total": student.max_total,
        "gpa": student.gpa,
        "result_status": student.result_status,
        "salt": student.salt,
        "leaf_hash": student.leaf_hash,
        "root_hash": root_hash
    }


@router.get("/{roll_no}/proof", response_model=MerkleProofResponse)
def get_student_proof(roll_no: str, db: Session = Depends(get_db)):
    """
    Generates and returns the complete Merkle inclusion proof (audit path) for the student's result.
    """
    student = db.query(Student).filter(Student.roll_no == roll_no, Student.is_active == True).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with roll number '{roll_no}' not found in active ledger."
        )

    active_ledger = db.query(LedgerHead).filter(LedgerHead.is_active == True).order_by(LedgerHead.id.desc()).first()
    if not active_ledger:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No active ledger head found."
        )

    # Fetch only leaf_hash column ordered by leaf_index for ultra-fast proof generation (<10ms)
    leaf_hashes = [
        r[0] for r in db.query(Student.leaf_hash)
        .filter(Student.is_active == True)
        .order_by(Student.leaf_index.asc())
        .all()
    ]

    tree = MerkleTree(leaf_hashes)
    raw_proof = tree.get_proof(student.leaf_index)

    # Format proof steps according to contract
    audit_path = [
        MerkleProofStep(position=step["position"], hash=step["hash"])
        for step in raw_proof
    ]

    is_valid = verify_merkle_proof(student.leaf_hash, raw_proof, active_ledger.root_hash)

    return MerkleProofResponse(
        roll_no=student.roll_no,
        leaf_hash=student.leaf_hash,
        leaf_index=student.leaf_index,
        root_hash=active_ledger.root_hash,
        published_at=active_ledger.published_at,
        audit_path=audit_path,
        is_valid=is_valid
    )


@router.post("/verify", response_model=VerifyResponse)
def verify_result_proof(payload: VerifyRequest):
    """
    Validates a Merkle inclusion proof mathematically:
    Iterates through the audit path, recalculates the parent hashes, and checks against the expected root.
    """
    current_hash = payload.leaf_hash.strip().lower()

    for step in payload.audit_path:
        sibling = step.hash.strip().lower()
        if step.position == "right":
            current_hash = hash_pair(current_hash, sibling)
        elif step.position == "left":
            current_hash = hash_pair(sibling, current_hash)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid position in audit path: {step.position}"
            )

    expected = payload.root_hash.strip().lower()
    verified = (current_hash == expected)

    return VerifyResponse(
        verified=verified,
        calculated_root=current_hash,
        expected_root=expected
    )
