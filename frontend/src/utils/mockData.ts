import { StudentResult, MerkleProofResponse, CompactQRPayload, CorrectionRequest, IntegrityCheckResponse } from '../types';

export const PUBLISHED_ROOT_HASH = '25d1acf7fa7263c5dc525c0b1e6223732d110283be25f951b07713ca170660b5';

export const MOCK_STUDENTS: StudentResult[] = [
  {
    roll_no: '2024CS001',
    student_name: 'Aarav Sharma',
    course: 'B.Tech CSE',
    semester: 5,
    academic_year: '2025-2026',
    subjects: [
      { subject_code: 'CS501', subject_name: 'Operating Systems', marks_obtained: 88, max_marks: 100, grade: 'A' },
      { subject_code: 'CS502', subject_name: 'Database Management Systems', marks_obtained: 92, max_marks: 100, grade: 'A+' },
      { subject_code: 'CS503', subject_name: 'Computer Networks', marks_obtained: 84, max_marks: 100, grade: 'A' },
      { subject_code: 'CS504', subject_name: 'Theory of Computation', marks_obtained: 79, max_marks: 100, grade: 'B+' }
    ],
    total_marks: 343,
    max_total: 400,
    gpa: 8.58,
    result_status: 'PASS',
    salt: 'a8f3b21c',
    leaf_hash: '0e5a38e8a8c2a9b34b377826ce6d71f8977a170c0ce8b845b18ddc447c58daba'
  },
  {
    roll_no: '2024CS002',
    student_name: 'Diya Patel',
    course: 'B.Tech CSE',
    semester: 5,
    academic_year: '2025-2026',
    subjects: [
      { subject_code: 'CS501', subject_name: 'Operating Systems', marks_obtained: 95, max_marks: 100, grade: 'O' },
      { subject_code: 'CS502', subject_name: 'Database Management Systems', marks_obtained: 90, max_marks: 100, grade: 'A+' },
      { subject_code: 'CS503', subject_name: 'Computer Networks', marks_obtained: 91, max_marks: 100, grade: 'A+' },
      { subject_code: 'CS504', subject_name: 'Theory of Computation', marks_obtained: 88, max_marks: 100, grade: 'A' }
    ],
    total_marks: 364,
    max_total: 400,
    gpa: 9.10,
    result_status: 'PASS',
    salt: 'b9d4c32d',
    leaf_hash: 'd479b1117f725048f91799ce76e5c6b8e5bfdad077f2c70f2473d0e5e72c098b'
  },
  {
    roll_no: '2024CS003',
    student_name: 'Rohan Verma',
    course: 'B.Tech CSE',
    semester: 5,
    academic_year: '2025-2026',
    subjects: [
      { subject_code: 'CS501', subject_name: 'Operating Systems', marks_obtained: 68, max_marks: 100, grade: 'B' },
      { subject_code: 'CS502', subject_name: 'Database Management Systems', marks_obtained: 72, max_marks: 100, grade: 'B+' },
      { subject_code: 'CS503', subject_name: 'Computer Networks', marks_obtained: 65, max_marks: 100, grade: 'C' },
      { subject_code: 'CS504', subject_name: 'Theory of Computation', marks_obtained: 70, max_marks: 100, grade: 'B' }
    ],
    total_marks: 275,
    max_total: 400,
    gpa: 6.88,
    result_status: 'PASS',
    salt: 'c1e5d43e',
    leaf_hash: 'e2460b826e8e4e6100aa2b7cc95ac71969595f9a4fc8b352fcabb9e7b917d1ad'
  },
  {
    roll_no: '2024CS004',
    student_name: 'Ananya Iyer',
    course: 'B.Tech CSE',
    semester: 5,
    academic_year: '2025-2026',
    subjects: [
      { subject_code: 'CS501', subject_name: 'Operating Systems', marks_obtained: 82, max_marks: 100, grade: 'A' },
      { subject_code: 'CS502', subject_name: 'Database Management Systems', marks_obtained: 86, max_marks: 100, grade: 'A' },
      { subject_code: 'CS503', subject_name: 'Computer Networks', marks_obtained: 89, max_marks: 100, grade: 'A' },
      { subject_code: 'CS504', subject_name: 'Theory of Computation', marks_obtained: 84, max_marks: 100, grade: 'A' }
    ],
    total_marks: 341,
    max_total: 400,
    gpa: 8.52,
    result_status: 'PASS',
    salt: 'd2f6e54f',
    leaf_hash: '4a96ae699564dd36d7240b29629b15eecb7dde91d669592a1f77fb4381054516'
  }
];

export const MOCK_PROOFS: Record<string, MerkleProofResponse> = {
  '2024CS001': {
    roll_no: '2024CS001',
    leaf_hash: '0e5a38e8a8c2a9b34b377826ce6d71f8977a170c0ce8b845b18ddc447c58daba',
    leaf_index: 0,
    root_hash: PUBLISHED_ROOT_HASH,
    published_at: '2026-11-20T10:00:00Z',
    audit_path: [
      { position: 'right', hash: 'd479b1117f725048f91799ce76e5c6b8e5bfdad077f2c70f2473d0e5e72c098b' },
      { position: 'right', hash: '08be060b0cdffc8ee312b013f54708ebbe5795a864a3c8958bb3ae18b0d43ede' }
    ],
    is_valid: true
  },
  '2024CS002': {
    roll_no: '2024CS002',
    leaf_hash: 'd479b1117f725048f91799ce76e5c6b8e5bfdad077f2c70f2473d0e5e72c098b',
    leaf_index: 1,
    root_hash: PUBLISHED_ROOT_HASH,
    published_at: '2026-11-20T10:00:00Z',
    audit_path: [
      { position: 'left', hash: '0e5a38e8a8c2a9b34b377826ce6d71f8977a170c0ce8b845b18ddc447c58daba' },
      { position: 'right', hash: '08be060b0cdffc8ee312b013f54708ebbe5795a864a3c8958bb3ae18b0d43ede' }
    ],
    is_valid: true
  },
  '2024CS003': {
    roll_no: '2024CS003',
    leaf_hash: 'e2460b826e8e4e6100aa2b7cc95ac71969595f9a4fc8b352fcabb9e7b917d1ad',
    leaf_index: 2,
    root_hash: PUBLISHED_ROOT_HASH,
    published_at: '2026-11-20T10:00:00Z',
    audit_path: [
      { position: 'right', hash: '4a96ae699564dd36d7240b29629b15eecb7dde91d669592a1f77fb4381054516' },
      { position: 'left', hash: '373bb3b5dbf05ba1481aec635b4651cf6574633e38ae4fd00841c5dacaa8030e' }
    ],
    is_valid: true
  },
  '2024CS004': {
    roll_no: '2024CS004',
    leaf_hash: '4a96ae699564dd36d7240b29629b15eecb7dde91d669592a1f77fb4381054516',
    leaf_index: 3,
    root_hash: PUBLISHED_ROOT_HASH,
    published_at: '2026-11-20T10:00:00Z',
    audit_path: [
      { position: 'left', hash: 'e2460b826e8e4e6100aa2b7cc95ac71969595f9a4fc8b352fcabb9e7b917d1ad' },
      { position: 'left', hash: '373bb3b5dbf05ba1481aec635b4651cf6574633e38ae4fd00841c5dacaa8030e' }
    ],
    is_valid: true
  }
};

export function getCompactQRPayload(rollNo: string): CompactQRPayload {
  const proof = MOCK_PROOFS[rollNo] || MOCK_PROOFS['2024CS001'];
  return {
    v: 1,
    roll: proof.roll_no,
    leaf: proof.leaf_hash,
    root: proof.root_hash,
    proof: proof.audit_path.map(step => ({
      p: step.position === 'left' ? 'L' : 'R',
      h: step.hash
    })),
    verify_url: `https://verimark.edu/verify?roll=${proof.roll_no}`
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
