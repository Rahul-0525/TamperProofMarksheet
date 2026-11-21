import { StudentResult, MerkleProofResponse, CompactQRPayload, CorrectionRequest, IntegrityCheckResponse } from '../types';
import cohortData from './generatedCohort.json';

export const PUBLISHED_ROOT_HASH = cohortData.root_hash;

export const MOCK_STUDENTS: StudentResult[] = cohortData.students as StudentResult[];

export const MOCK_PROOFS: Record<string, MerkleProofResponse> = cohortData.proofs as Record<string, MerkleProofResponse>;

export interface ActiveCohort {
  isCustom: boolean;
  students: StudentResult[];
  proofs: Record<string, MerkleProofResponse>;
  rootHash: string;
  batchId?: string;
  publishedAt?: string;
  totalStudents: number;
}

/**
 * Returns the currently active ledger cohort.
 * If the user uploaded a custom CSV (e.g. rolls 23-98), ONLY those custom
 * students and proofs are active. If not, it falls back to the default 55-student LPU cohort.
 */
export function getActiveCohort(): ActiveCohort {
  try {
    const rawStudents = localStorage.getItem('trugrade_custom_students');
    const rawProofs = localStorage.getItem('trugrade_custom_proofs');
    const rawRoot = localStorage.getItem('trugrade_custom_root');
    const rawBatch = localStorage.getItem('trugrade_custom_batch');

    if (rawStudents) {
      const customStudents: StudentResult[] = JSON.parse(rawStudents);
      if (Array.isArray(customStudents) && customStudents.length > 0) {
        const customProofs: Record<string, MerkleProofResponse> = rawProofs ? JSON.parse(rawProofs) : {};
        const firstRoll = customStudents[0]?.roll_no;
        const customRoot = rawRoot || customProofs[firstRoll]?.root_hash || PUBLISHED_ROOT_HASH;
        const batchInfo = rawBatch ? JSON.parse(rawBatch) : null;

        return {
          isCustom: true,
          students: customStudents,
          proofs: customProofs,
          rootHash: customRoot,
          batchId: batchInfo?.batch_id,
          publishedAt: batchInfo?.published_at,
          totalStudents: customStudents.length
        };
      }
    }
  } catch (e) {
    console.warn('[TruGrade] Error loading custom cohort from localStorage:', e);
  }

  return {
    isCustom: false,
    students: MOCK_STUDENTS,
    proofs: MOCK_PROOFS,
    rootHash: PUBLISHED_ROOT_HASH,
    totalStudents: MOCK_STUDENTS.length
  };
}

/**
 * Clears custom uploaded CSV data from the browser and restores the default 55-student cohort.
 */
export function resetToDefaultCohort(): void {
  try {
    localStorage.removeItem('trugrade_custom_students');
    localStorage.removeItem('trugrade_custom_proofs');
    localStorage.removeItem('trugrade_custom_root');
    localStorage.removeItem('trugrade_custom_batch');
  } catch (e) {}
}

export function getCompactQRPayload(rollNo: string): CompactQRPayload {
  const cohort = getActiveCohort();
  const norm = (rollNo || '').toLowerCase().trim();

  // 1. Exact match in active cohort proofs
  let proof: MerkleProofResponse | undefined =
    cohort.proofs[rollNo] ||
    Object.values(cohort.proofs).find(p => p.roll_no.toLowerCase() === norm);

  // 2. Numeric / suffix match (e.g. user typed "23" matching roll "23" or "...023")
  if (!proof && norm) {
    proof = Object.values(cohort.proofs).find(p => {
      const r = p.roll_no.toLowerCase();
      return r === norm || r.endsWith(norm) || r.includes(norm);
    });
  }

  // 3. Fallback: First student in active cohort
  if (!proof) {
    const firstRoll = cohort.students[0]?.roll_no;
    if (firstRoll && cohort.proofs[firstRoll]) {
      proof = cohort.proofs[firstRoll];
    } else {
      proof = Object.values(cohort.proofs)[0];
    }
  }

  // 4. Guaranteed emergency fallback
  const fallbackProof: MerkleProofResponse = MOCK_PROOFS['2024CS001'] || Object.values(MOCK_PROOFS)[0];
  const targetProof = proof || fallbackProof;

  return {
    v: 1,
    roll: targetProof.roll_no,
    leaf: targetProof.leaf_hash,
    root: targetProof.root_hash || cohort.rootHash,
    proof: (targetProof.audit_path || []).map(step => ({
      p: step.position === 'left' ? 'L' : 'R',
      h: step.hash
    })),
    verify_url: `https://verimark.edu/verify?roll=${encodeURIComponent(targetProof.roll_no)}`
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
