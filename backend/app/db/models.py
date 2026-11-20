from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base


class Student(Base):
    __tablename__ = "students"

    roll_no = Column(String(64), primary_key=True, index=True)
    student_name = Column(String(255), nullable=False)
    course = Column(String(128), nullable=False)
    semester = Column(Integer, nullable=False)
    academic_year = Column(String(32), nullable=False)
    total_marks = Column(Float, nullable=False, default=0.0)
    max_total = Column(Float, nullable=False, default=0.0)
    gpa = Column(Float, nullable=False, default=0.0)
    result_status = Column(String(32), nullable=False, default="PASS")
    salt = Column(String(32), nullable=False)
    leaf_hash = Column(String(64), nullable=False, index=True)
    leaf_index = Column(Integer, nullable=False, default=0)
    batch_id = Column(String(64), nullable=False, index=True)
    is_active = Column(Boolean, nullable=False, default=True)

    subjects = relationship("SubjectMark", back_populates="student", cascade="all, delete-orphan", order_by="SubjectMark.subject_code")


class SubjectMark(Base):
    __tablename__ = "subject_marks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_roll_no = Column(String(64), ForeignKey("students.roll_no", ondelete="CASCADE"), nullable=False, index=True)
    subject_code = Column(String(32), nullable=False, index=True)
    subject_name = Column(String(255), nullable=False)
    marks_obtained = Column(Float, nullable=False)
    max_marks = Column(Float, nullable=False, default=100.0)
    grade = Column(String(10), nullable=False)

    student = relationship("Student", back_populates="subjects")


class LedgerHead(Base):
    __tablename__ = "ledger_head"

    id = Column(Integer, primary_key=True, autoincrement=True)
    batch_id = Column(String(64), nullable=False, index=True)
    root_hash = Column(String(64), nullable=False, index=True)
    total_records = Column(Integer, nullable=False, default=0)
    published_at = Column(String(64), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)


class CorrectionRequest(Base):
    __tablename__ = "corrections"

    id = Column(String(64), primary_key=True, index=True)
    roll_no = Column(String(64), nullable=False, index=True)
    subject_code = Column(String(32), nullable=False)
    old_marks = Column(Float, nullable=False)
    new_marks = Column(Float, nullable=False)
    reason = Column(Text, nullable=False)
    proposed_by = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False, default="AWAITING_APPROVALS")  # AWAITING_APPROVALS, AWAITING_SECOND_APPROVAL, APPROVED, REJECTED
    
    # Dual-signatures
    dean_signature = Column(String(128), nullable=True)
    dean_public_key = Column(String(128), nullable=True)
    dean_signed_at = Column(String(64), nullable=True)

    controller_signature = Column(String(128), nullable=True)
    controller_public_key = Column(String(128), nullable=True)
    controller_signed_at = Column(String(64), nullable=True)

    created_at = Column(String(64), nullable=False, default=lambda: datetime.now(timezone.utc).isoformat())
    updated_at = Column(String(64), nullable=False, default=lambda: datetime.now(timezone.utc).isoformat())
