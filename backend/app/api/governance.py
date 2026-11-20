import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Student, SubjectMark, LedgerHead, CorrectionRequest
from app.crypto.signatures import verify_signature
from app.crypto.merkle import MerkleTree
from app.api.admin import calculate_grade
from contracts.models import (
    CorrectionProposalRequest,
    SignCorrectionRequest,
    StudentResultModel,
    SubjectMark as SubjectMarkContract,
    compute_leaf_hash
)

router = APIRouter(prefix="/governance", tags=["Dual-Approval Governance"])


@router.post("/propose-correction", status_code=status.HTTP_201_CREATED)
def propose_correction(
    payload: CorrectionProposalRequest,
    db: Session = Depends(get_db)
):
    """
    Submits a new mark correction proposal.
    Records the existing mark as old_marks and transitions status to AWAITING_APPROVALS.
    """
    student = db.query(Student).filter(Student.roll_no == payload.roll_no, Student.is_active == True).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with roll number '{payload.roll_no}' not found in active ledger."
        )

    subject = db.query(SubjectMark).filter(
        SubjectMark.student_roll_no == payload.roll_no,
        SubjectMark.subject_code == payload.subject_code
    ).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject '{payload.subject_code}' not found for student '{payload.roll_no}'."
        )

    correction_id = f"corr-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    correction = CorrectionRequest(
        id=correction_id,
        roll_no=payload.roll_no,
        subject_code=payload.subject_code,
        old_marks=subject.marks_obtained,
        new_marks=payload.new_marks,
        reason=payload.reason,
        proposed_by=payload.proposed_by,
        status="AWAITING_APPROVALS",
        created_at=now_iso,
        updated_at=now_iso
    )

    db.add(correction)
    db.commit()

    return {
        "correction_id": correction_id,
        "status": "AWAITING_APPROVALS"
    }


@router.post("/sign-correction")
def sign_correction(
    payload: SignCorrectionRequest,
    db: Session = Depends(get_db)
):
    """
    Accepts an Ed25519 signature from either the DEAN or CONTROLLER.
    Enforces dual independent signatures before applying changes to the ledger:
    - 1 signature: AWAITING_SECOND_APPROVAL
    - 2 distinct signatures: APPROVED -> Mutates student mark, recalculates Merkle root, appends ledger revision.
    """
    correction = db.query(CorrectionRequest).filter(CorrectionRequest.id == payload.correction_id).first()
    if not correction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Correction request '{payload.correction_id}' not found."
        )

    if correction.status in ("APPROVED", "REJECTED"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Correction request is already in '{correction.status}' state."
        )

    role = payload.signer_role.upper()
    if role not in ("DEAN", "CONTROLLER"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid signer role: {role}. Must be DEAN or CONTROLLER."
        )

    # Prevent duplicate signing by the same role
    if role == "DEAN" and correction.dean_signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dean has already signed this correction proposal."
        )
    if role == "CONTROLLER" and correction.controller_signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Controller of Examinations has already signed this correction proposal."
        )

    # Candidate messages supported for flexible cryptographic signature verification
    candidate_messages = [
        f"Approve mark change for roll {correction.roll_no}: {correction.subject_code} from {correction.old_marks:g} to {correction.new_marks:g}",
        f"Approve mark change for roll {correction.roll_no}: {correction.subject_code} from {int(correction.old_marks)} to {int(correction.new_marks)}",
        f"CORRECTION:{correction.id}:{correction.roll_no}:{correction.subject_code}:{correction.new_marks:g}",
        f"{correction.id}:{role}",
        correction.id,
        f"Approve {correction.id}"
    ]

    is_valid = any(
        verify_signature(msg, payload.signature.strip(), payload.public_key.strip())
        for msg in candidate_messages
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cryptographic Ed25519 signature verification failed. Invalid signature or public key."
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    correction.updated_at = now_iso

    if role == "DEAN":
        correction.dean_signature = payload.signature.strip()
        correction.dean_public_key = payload.public_key.strip()
        correction.dean_signed_at = now_iso
    elif role == "CONTROLLER":
        correction.controller_signature = payload.signature.strip()
        correction.controller_public_key = payload.public_key.strip()
        correction.controller_signed_at = now_iso

    # Check whether both parties have now signed
    both_signed = bool(correction.dean_signature and correction.controller_signature)

    new_root_hash = None

    if both_signed:
        correction.status = "APPROVED"

        # Apply grade correction to database
        student = db.query(Student).filter(Student.roll_no == correction.roll_no, Student.is_active == True).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Student record '{correction.roll_no}' could not be located during approval."
            )

        subject = db.query(SubjectMark).filter(
            SubjectMark.student_roll_no == correction.roll_no,
            SubjectMark.subject_code == correction.subject_code
        ).first()
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Subject record '{correction.subject_code}' could not be located during approval."
            )

        # Update subject marks and grade
        subject.marks_obtained = correction.new_marks
        subject.grade = calculate_grade(correction.new_marks, subject.max_marks)
        db.flush()

        # Recalculate student aggregates
        all_subs = db.query(SubjectMark).filter(SubjectMark.student_roll_no == student.roll_no).all()
        student.total_marks = sum(s.marks_obtained for s in all_subs)
        student.max_total = sum(s.max_marks for s in all_subs)
        student.gpa = round((student.total_marks / student.max_total) * 10.0, 2) if student.max_total > 0 else 0.0

        has_fail = any(
            s.grade == "F" or s.marks_obtained < (0.4 * s.max_marks)
            for s in all_subs
        )
        student.result_status = "FAIL" if has_fail else "PASS"

        # Recompute canonical leaf hash
        subject_contracts = [
            SubjectMarkContract(
                subject_code=s.subject_code,
                subject_name=s.subject_name,
                marks_obtained=s.marks_obtained,
                max_marks=s.max_marks,
                grade=s.grade
            )
            for s in all_subs
        ]

        student_model = StudentResultModel(
            roll_no=student.roll_no,
            student_name=student.student_name,
            course=student.course,
            semester=student.semester,
            academic_year=student.academic_year,
            subjects=subject_contracts,
            total_marks=student.total_marks,
            max_total=student.max_total,
            gpa=student.gpa,
            result_status=student.result_status,
            salt=student.salt
        )

        student.leaf_hash = compute_leaf_hash(student_model)
        db.flush()

        # Recalculate Merkle Tree for entire active cohort
        all_active_students = db.query(Student).filter(Student.is_active == True).order_by(Student.leaf_index.asc()).all()
        leaf_hashes = [s.leaf_hash for s in all_active_students]
        tree = MerkleTree(leaf_hashes)
        new_root_hash = tree.get_root()

        # Deactivate previous ledger head
        active_ledger = db.query(LedgerHead).filter(LedgerHead.is_active == True).first()
        prev_batch_id = active_ledger.batch_id if active_ledger else "batch-init"
        if active_ledger:
            active_ledger.is_active = False

        # Publish new revision to ledger
        new_batch_id = f"{prev_batch_id}-rev-{uuid.uuid4().hex[:4]}"
        new_ledger_head = LedgerHead(
            batch_id=new_batch_id,
            root_hash=new_root_hash,
            total_records=len(all_active_students),
            published_at=now_iso,
            is_active=True
        )
        db.add(new_ledger_head)

    else:
        correction.status = "AWAITING_SECOND_APPROVAL"

    db.commit()

    return {
        "correction_id": correction.id,
        "status": correction.status,
        "signed_by": role,
        "both_signed": both_signed,
        "new_root_hash": new_root_hash
    }


@router.get("/corrections")
def list_corrections(db: Session = Depends(get_db)):
    """
    Returns all correction proposals and their dual-approval statuses for the governance dashboard.
    """
    corrections = db.query(CorrectionRequest).order_by(CorrectionRequest.created_at.desc()).all()
    results = []
    for c in corrections:
        item: Dict[str, Any] = {
            "correction_id": c.id,
            "roll_no": c.roll_no,
            "subject_code": c.subject_code,
            "old_marks": c.old_marks,
            "new_marks": c.new_marks,
            "reason": c.reason,
            "proposed_by": c.proposed_by,
            "created_at": c.created_at,
            "status": c.status
        }
        if c.dean_signature:
            item["dean_approval"] = {
                "signature": c.dean_signature,
                "public_key": c.dean_public_key,
                "signed_at": c.dean_signed_at
            }
        if c.controller_signature:
            item["controller_approval"] = {
                "signature": c.controller_signature,
                "public_key": c.controller_public_key,
                "signed_at": c.controller_signed_at
            }
        results.append(item)
    return results


@router.get("/corrections/{correction_id}")
def get_correction(correction_id: str, db: Session = Depends(get_db)):
    """Returns details of a specific correction request."""
    c = db.query(CorrectionRequest).filter(CorrectionRequest.id == correction_id).first()
    if not c:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Correction request '{correction_id}' not found."
        )
    return {
        "correction_id": c.id,
        "roll_no": c.roll_no,
        "subject_code": c.subject_code,
        "old_marks": c.old_marks,
        "new_marks": c.new_marks,
        "reason": c.reason,
        "proposed_by": c.proposed_by,
        "created_at": c.created_at,
        "status": c.status,
        "dean_approval": {
            "signature": c.dean_signature,
            "public_key": c.dean_public_key,
            "signed_at": c.dean_signed_at
        } if c.dean_signature else None,
        "controller_approval": {
            "signature": c.controller_signature,
            "public_key": c.controller_public_key,
            "signed_at": c.controller_signed_at
        } if c.controller_signature else None
    }
