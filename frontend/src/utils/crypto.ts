import { StudentResult, MerkleProofStep } from '../types';

/**
 * Computes SHA-256 hash using the native Web Crypto API
 * Runs 100% client-side (no network request required)
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Builds the canonical string according to CONTRACT_SPEC.md:
 * "{roll_no}|{student_name}|{course}|{semester}|{sorted_subjects}|{total_marks}|{max_total}|{gpa}|{result_status}|{salt}"
 * 
 * sorted_subjects is sorted alphabetically by subject_code
 * format: "{subject_code}:{marks_obtained}:{max_marks}" joined by ";"
 */
export function buildCanonicalString(student: StudentResult): string {
  const sortedSubjects = [...student.subjects]
    .sort((a, b) => a.subject_code.localeCompare(b.subject_code))
    .map(s => `${s.subject_code}:${s.marks_obtained}:${s.max_marks}`)
    .join(';');

  return [
    student.roll_no.trim(),
    student.student_name.trim(),
    student.course.trim(),
    student.semester.toString(),
    sortedSubjects,
    student.total_marks.toString(),
    student.max_total.toString(),
    student.gpa.toFixed(2),
    student.result_status.trim().toUpperCase(),
    student.salt.trim()
  ].join('|');
}

/**
 * Computes the canonical leaf hash for a student record
 */
export async function computeLeafHash(student: StudentResult): Promise<string> {
  const canonical = buildCanonicalString(student);
  return await sha256(canonical);
}

/**
 * Verifies a Merkle proof path starting from leaf_hash up to root_hash
 * Returns computed root and step-by-step intermediate hashes
 */
export async function verifyMerkleProof(
  leafHash: string,
  auditPath: MerkleProofStep[],
  expectedRoot: string
): Promise<{
  isValid: boolean;
  computedRoot: string;
  steps: Array<{ stepIndex: number; left: string; right: string; parent: string; position: 'left' | 'right' }>;
}> {
  let currentHash = leafHash.toLowerCase();
  const steps: Array<{ stepIndex: number; left: string; right: string; parent: string; position: 'left' | 'right' }> = [];

  for (let i = 0; i < auditPath.length; i++) {
    const step = auditPath[i];
    const stepHash = step.hash.toLowerCase();
    let left: string;
    let right: string;

    if (step.position === 'right') {
      left = currentHash;
      right = stepHash;
    } else {
      left = stepHash;
      right = currentHash;
    }

    const parent = await sha256(left + right);
    steps.push({
      stepIndex: i + 1,
      left,
      right,
      parent,
      position: step.position
    });

    currentHash = parent;
  }

  const isValid = currentHash === expectedRoot.toLowerCase();
  return {
    isValid,
    computedRoot: currentHash,
    steps
  };
}
