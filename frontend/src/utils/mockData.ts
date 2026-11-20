import { StudentResult, MerkleProofResponse, CompactQRPayload, CorrectionRequest, IntegrityCheckResponse } from '../types';
import cohortData from './generatedCohort.json';

export const PUBLISHED_ROOT_HASH = cohortData.root_hash;

export const MOCK_STUDENTS: StudentResult[] = cohortData.students as StudentResult[];

export const MOCK_PROOFS: Record<string, MerkleProofResponse> = cohortData.proofs as Record<string, MerkleProofResponse>;

export function getCompactQRPayload(rollNo: string): CompactQRPayload {
  let customProofs: Record<string, MerkleProofResponse> = {};
  try {
    const raw = localStorage.getItem('trugrade_custom_proofs');
    if (raw) customProofs = JSON.parse(raw);
  } catch (e) {}

  const norm = (rollNo || '').toLowerCase().trim();
  const allProofs = { ...MOCK_PROOFS, ...customProofs };

  // 1. Exact match
  let proof: MerkleProofResponse | undefined = allProofs[rollNo] || Object.values(allProofs).find(p => p.roll_no.toLowerCase() === norm);

  // 2. Numeric shorthand match (e.g. "19" -> "2024CS019")
  if (!proof && /^\d+$/.test(norm)) {
    const padded = norm.padStart(3, '0');
    proof = Object.values(allProofs).find(p => p.roll_no.endsWith(padded));
  }

  // 3. Fallback
  const fallbackProof: MerkleProofResponse = MOCK_PROOFS['2024CS001'] || Object.values(MOCK_PROOFS)[0];
  const targetProof = proof || fallbackProof;

  return {
    v: 1,
    roll: targetProof.roll_no,
    leaf: targetProof.leaf_hash,
    root: targetProof.root_hash,
    proof: targetProof.audit_path.map(step => ({
      p: step.position === 'left' ? 'L' : 'R',
      h: step.hash
    })),
    verify_url: `https://verimark.edu/verify?roll=${targetProof.roll_no}`
  };
}

export const MOCK_CORRECTIONS: CorrectionRequest[] = [
  {
    correction_id: 'corr-8f19b2',
    roll_no: '2024CS003',
    student_name: 'Rohan Verma',
    subject_code: 'CS501',
    old_marks: 68,
    new_marks: 82,
    reason: 'Re-evaluation discrepancy cleared by Examination Board (Question 4 evaluation omitted in total)',
    proposed_by: 'Prof. S. Sengupta (Head Examiner)',
    created_at: '2026-11-20T14:30:00Z',
    status: 'AWAITING_APPROVALS'
  },
  {
    correction_id: 'corr-9a41c7',
    roll_no: '2024CS001',
    student_name: 'Aarav Sharma',
    subject_code: 'CS504',
    old_marks: 79,
    new_marks: 85,
    reason: 'Scrutiny committee verified re-totaling totaling typo in mid-sem component',
    proposed_by: 'Dr. Neha Kapoor (Registrar Office)',
    created_at: '2026-11-20T11:15:00Z',
    status: 'AWAITING_SECOND_APPROVAL',
    dean_approval: {
      signature: '9f2a74c6d05be19e75a32b05f2b841a54b9d3e8c2017fe5b6a789c0de1f2a345',
      public_key: 'b4a8e29d71c350619f50e82c7a10df890b23ce517a94ef321b0dc56184a29c11',
      signed_at: '2026-11-20T12:00:00Z'
    }
  }
];

export const MOCK_AUDIT_SECURE: IntegrityCheckResponse = {
  status: 'SECURE',
  checked_at: new Date().toISOString(),
  total_records: 4,
  active_ledger_root: PUBLISHED_ROOT_HASH,
  recomputed_db_root: PUBLISHED_ROOT_HASH,
  tampered_records: []
};

export const MOCK_AUDIT_TAMPERED: IntegrityCheckResponse = {
  status: 'COMPROMISED',
  checked_at: new Date().toISOString(),
  total_records: 4,
  active_ledger_root: PUBLISHED_ROOT_HASH,
  recomputed_db_root: '93f8e590ca173d5b248a176840d859187ecad6bfd92031124ef98276189bc4a1',
  tampered_records: [
    {
      roll_no: '2024CS003',
      student_name: 'Rohan Verma',
      issue: 'Direct SQL Tamper Detected: Database row modified via UPDATE results SET marks_obtained = 99 WHERE subject_code = "CS502". Recomputed leaf hash does not match immutable ledger leaf.'
    }
  ]
};
