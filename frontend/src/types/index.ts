/**
 * TruGrade — Frontend TypeScript Contracts
 * Single Source of Truth for Data Types & API Payloads
 */

export interface SubjectMark {
  subject_code: string;
  subject_name: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
}

export interface StudentResult {
  roll_no: string;
  student_name: string;
  course: string;
  semester: number;
  academic_year: string;
  subjects: SubjectMark[];
  total_marks: number;
  max_total: number;
  gpa: number;
  result_status: 'PASS' | 'FAIL' | 'WITHHELD';
  salt: string;
  leaf_hash: string;
}

export interface MerkleProofStep {
  position: 'left' | 'right';
  hash: string;
}

export interface MerkleProofResponse {
  roll_no: string;
  leaf_hash: string;
  leaf_index: number;
  root_hash: string;
  published_at: string;
  audit_path: MerkleProofStep[];
  is_valid: boolean;
}

export interface CompactQRPayload {
  v: number; // version (1)
  roll: string;
  leaf: string;
  root: string;
  proof: Array<{ p: 'L' | 'R'; h: string }>;
  verify_url?: string;
}

export type SignerRole = 'DEAN' | 'CONTROLLER';

export interface CorrectionRequest {
  correction_id: string;
  roll_no: string;
  student_name?: string;
  subject_code: string;
  old_marks: number;
  new_marks: number;
  reason: string;
  proposed_by: string;
  created_at: string;
  status: 'AWAITING_APPROVALS' | 'AWAITING_SECOND_APPROVAL' | 'APPROVED' | 'REJECTED';
  dean_approval?: {
    signature: string;
    public_key: string;
    signed_at: string;
  };
  controller_approval?: {
    signature: string;
    public_key: string;
    signed_at: string;
  };
}

export interface TamperReport {
  roll_no: string;
  student_name: string;
  issue: string;
}

export interface IntegrityCheckResponse {
  status: 'SECURE' | 'COMPROMISED';
  checked_at: string;
  total_records: number;
  active_ledger_root: string;
  recomputed_db_root: string;
  tampered_records: TamperReport[];
}
