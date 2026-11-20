import io
import csv
import uuid
import secrets
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Student, SubjectMark, LedgerHead
from app.crypto.merkle import MerkleTree
from contracts.models import StudentResultModel, SubjectMark as SubjectMarkContract, compute_leaf_hash

router = APIRouter(prefix="/admin", tags=["Admin & Publishing"])


def calculate_grade(marks: float, max_marks: float) -> str:
    """Helper to derive grade if omitted."""
    percentage = (marks / max_marks) * 100 if max_marks > 0 else 0
    if percentage >= 90:
        return "O"
    elif percentage >= 80:
        return "A+"
    elif percentage >= 70:
        return "A"
    elif percentage >= 60:
        return "B+"
    elif percentage >= 50:
        return "B"
    elif percentage >= 40:
        return "P"
    else:
        return "F"


@router.post("/publish-batch", status_code=status.HTTP_201_CREATED)
async def publish_batch(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Ingests CSV containing student results, calculates canonical leaf hashes,
    builds the Merkle tree, stores records in the database, and publishes the new root to LedgerHead.
    """
    if not file.filename.endswith(('.csv', '.txt')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a CSV file."
        )

    try:
        content = await file.read()
        text_stream = io.StringIO(content.decode("utf-8-sig"))
        reader = csv.DictReader(text_stream)
        
        # Verify required CSV columns
        required_columns = {"roll_no", "student_name", "course", "semester", "academic_year", 
                            "subject_code", "subject_name", "marks_obtained"}
        if not required_columns.issubset(set(reader.fieldnames or [])):
            missing = required_columns - set(reader.fieldnames or [])
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"CSV is missing required columns: {', '.join(missing)}"
            )

        # Group rows by student roll_no while preserving row order
        student_order: List[str] = []
        students_map: Dict[str, Dict[str, Any]] = {}

        for row in reader:
            roll_no = row["roll_no"].strip()
            if not roll_no:
                continue

            if roll_no not in students_map:
                student_order.append(roll_no)
                students_map[roll_no] = {
                    "roll_no": roll_no,
                    "student_name": row["student_name"].strip(),
                    "course": row["course"].strip(),
                    "semester": int(row["semester"].strip()),
                    "academic_year": row["academic_year"].strip(),
                    "subjects": []
                }

            marks_obtained = float(row["marks_obtained"].strip())
            max_marks = float(row.get("max_marks", "100").strip() or 100.0)
            grade = row.get("grade", "").strip() or calculate_grade(marks_obtained, max_marks)

            students_map[roll_no]["subjects"].append({
                "subject_code": row["subject_code"].strip(),
                "subject_name": row["subject_name"].strip(),
                "marks_obtained": marks_obtained,
                "max_marks": max_marks,
                "grade": grade
            })

        if not student_order:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV contains no valid student rows."
            )

        batch_id = f"batch-{uuid.uuid4().hex[:8]}"
        published_at = datetime.now(timezone.utc).isoformat()

        processed_students: List[Dict[str, Any]] = []
        leaf_hashes: List[str] = []

        for idx, roll_no in enumerate(student_order):
            s_data = students_map[roll_no]
            total_marks = sum(s["marks_obtained"] for s in s_data["subjects"])
            max_total = sum(s["max_marks"] for s in s_data["subjects"])
            gpa = round((total_marks / max_total) * 10.0, 2) if max_total > 0 else 0.0

            has_fail = any(
                s["grade"] == "F" or s["marks_obtained"] < (0.4 * s["max_marks"])
                for s in s_data["subjects"]
            )
            result_status = "FAIL" if has_fail else "PASS"
            salt = secrets.token_hex(4)  # 8-character hex string

            subject_contracts = [
                SubjectMarkContract(
                    subject_code=s["subject_code"],
                    subject_name=s["subject_name"],
                    marks_obtained=s["marks_obtained"],
                    max_marks=s["max_marks"],
                    grade=s["grade"]
                )
                for s in s_data["subjects"]
            ]

            student_model = StudentResultModel(
                roll_no=s_data["roll_no"],
                student_name=s_data["student_name"],
                course=s_data["course"],
                semester=s_data["semester"],
                academic_year=s_data["academic_year"],
                subjects=subject_contracts,
                total_marks=total_marks,
                max_total=max_total,
                gpa=gpa,
                result_status=result_status,
                salt=salt
            )

            leaf_hash = compute_leaf_hash(student_model)
            leaf_hashes.append(leaf_hash)

            processed_students.append({
                "student_model": student_model,
                "leaf_hash": leaf_hash,
                "leaf_index": idx,
                "raw_subjects": s_data["subjects"]
            })

        # Construct Merkle Tree
        tree = MerkleTree(leaf_hashes)
        root_hash = tree.get_root()

        # Database transaction: deactivate previous active ledger head and students
        db.query(LedgerHead).filter(LedgerHead.is_active == True).update({"is_active": False})
        
        # Clean previous students and subject marks
        db.query(SubjectMark).delete()
        db.query(Student).delete()
        db.flush()

        # Persist new batch into DB using high-speed bulk insertion
        student_records = []
        subject_records = []
        for item in processed_students:
            sm = item["student_model"]
            db_student = Student(
                roll_no=sm.roll_no,
                student_name=sm.student_name,
                course=sm.course,
                semester=sm.semester,
                academic_year=sm.academic_year,
                total_marks=sm.total_marks,
                max_total=sm.max_total,
                gpa=sm.gpa,
                result_status=sm.result_status,
                salt=sm.salt,
                leaf_hash=item["leaf_hash"],
                leaf_index=item["leaf_index"],
                batch_id=batch_id,
                is_active=True
            )
            student_records.append(db_student)

            for s in item["raw_subjects"]:
                db_subject = SubjectMark(
                    student_roll_no=sm.roll_no,
                    subject_code=s["subject_code"],
                    subject_name=s["subject_name"],
                    marks_obtained=s["marks_obtained"],
                    max_marks=s["max_marks"],
                    grade=s["grade"]
                )
                subject_records.append(db_subject)

        db.add_all(student_records)
        db.add_all(subject_records)

        # Create LedgerHead
        ledger_head = LedgerHead(
            batch_id=batch_id,
            root_hash=root_hash,
            total_records=len(processed_students),
            published_at=published_at,
            is_active=True
        )
        db.add(ledger_head)
        db.commit()

        return {
            "batch_id": batch_id,
            "total_students": len(processed_students),
            "root_hash": root_hash,
            "published_at": published_at
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to publish batch: {str(e)}"
        )


@router.get("/ledger-heads")
def get_ledger_heads(db: Session = Depends(get_db)):
    """Returns all ledger heads for audit/history."""
    heads = db.query(LedgerHead).order_by(LedgerHead.id.desc()).all()
    return [
        {
            "id": h.id,
            "batch_id": h.batch_id,
            "root_hash": h.root_hash,
            "total_records": h.total_records,
            "published_at": h.published_at,
            "is_active": h.is_active
        }
        for h in heads
    ]
