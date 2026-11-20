import { StudentResult, MerkleProofStep, MerkleProofResponse, SubjectMark } from '../types';

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

export interface MintedBatch {
  batch_id: string;
  total_students: number;
  root_hash: string;
  published_at: string;
  sample_roll_no: string;
  students: StudentResult[];
  proofs: Record<string, MerkleProofResponse>;
}

/**
 * Builds binary Merkle Tree client-side using Web Crypto SHA-256
 */
export async function buildClientMerkleTree(leafHashes: string[]): Promise<{
  root: string;
  levels: string[][];
  getProof: (leafIndex: number) => MerkleProofStep[];
}> {
  if (!leafHashes.length) {
    return { root: '', levels: [[]], getProof: () => [] };
  }

  let currentLevel = leafHashes.map(h => h.toLowerCase());
  const levels: string[][] = [currentLevel];

  while (currentLevel.length > 1) {
    if (currentLevel.length % 2 !== 0) {
      currentLevel = [...currentLevel, currentLevel[currentLevel.length - 1]];
    }

    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const combined = currentLevel[i] + currentLevel[i + 1];
      const parent = await sha256(combined);
      nextLevel.push(parent);
    }

    levels.push(nextLevel);
    currentLevel = nextLevel;
  }

  const root = currentLevel[0] || '';

  const getProof = (leafIndex: number): MerkleProofStep[] => {
    if (leafIndex < 0 || leafIndex >= leafHashes.length) {
      throw new Error(`Leaf index ${leafIndex} out of bounds (0..${leafHashes.length - 1})`);
    }

    const proof: MerkleProofStep[] = [];
    let idx = leafIndex;

    for (let levelIdx = 0; levelIdx < levels.length - 1; levelIdx++) {
      let level = levels[levelIdx];
      if (level.length % 2 !== 0) {
        level = [...level, level[level.length - 1]];
      }

      const isRightChild = idx % 2 === 1;
      const siblingIdx = isRightChild ? idx - 1 : idx + 1;
      const siblingHash = level[siblingIdx];
      const position: 'left' | 'right' = isRightChild ? 'left' : 'right';

      proof.push({ position, hash: siblingHash });
      idx = Math.floor(idx / 2);
    }

    return proof;
  };

  return { root, levels, getProof };
}

/**
 * Client-Side CSV Parser & Cryptographic Ledger Minter:
 * Parses uploaded semester CSV, aggregates student subject marks, computes GPA,
 * calculates canonical leaf hashes, builds the Merkle Tree, and generates audit proofs.
 */
export async function parseCSVAndBuildLedger(csvText: string): Promise<MintedBatch> {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one student record.');
  }

  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));

  const getColIdx = (name: string) => headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
  const rollIdx = getColIdx('roll_no');
  const nameIdx = getColIdx('student_name');
  const courseIdx = getColIdx('course');
  const semIdx = getColIdx('semester');
  const yearIdx = getColIdx('academic_year');
  const subCodeIdx = getColIdx('subject_code');
  const subNameIdx = getColIdx('subject_name');
  const marksIdx = getColIdx('marks_obtained');
  const maxMarksIdx = getColIdx('max_marks');
  const gradeIdx = getColIdx('grade');

  if (rollIdx === -1 || subCodeIdx === -1 || marksIdx === -1) {
    throw new Error('CSV must include at least roll_no, subject_code, and marks_obtained columns.');
  }

  const studentOrder: string[] = [];
  const studentsMap: Record<string, {
    roll_no: string;
    student_name: string;
    course: string;
    semester: number;
    academic_year: string;
    subjects: SubjectMark[];
  }> = {};

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;
    const cols = rawLine.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    const roll = cols[rollIdx];
    if (!roll) continue;

    if (!studentsMap[roll]) {
      studentOrder.push(roll);
      studentsMap[roll] = {
        roll_no: roll,
        student_name: nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : `Student ${roll}`,
        course: courseIdx !== -1 && cols[courseIdx] ? cols[courseIdx] : 'B.Tech CSE',
        semester: semIdx !== -1 && cols[semIdx] ? parseInt(cols[semIdx], 10) || 5 : 5,
        academic_year: yearIdx !== -1 && cols[yearIdx] ? cols[yearIdx] : '2025-2026',
        subjects: []
      };
    }

    const marks = parseFloat(cols[marksIdx]) || 0;
    const maxMarks = maxMarksIdx !== -1 && cols[maxMarksIdx] ? parseFloat(cols[maxMarksIdx]) || 100 : 100;
    let grade = gradeIdx !== -1 && cols[gradeIdx] ? cols[gradeIdx] : '';
    if (!grade) {
      const pct = (marks / maxMarks) * 100;
      if (pct >= 90) grade = 'O';
      else if (pct >= 80) grade = 'A+';
      else if (pct >= 70) grade = 'A';
      else if (pct >= 60) grade = 'B+';
      else if (pct >= 50) grade = 'B';
      else if (pct >= 40) grade = 'P';
      else grade = 'F';
    }

    studentsMap[roll].subjects.push({
      subject_code: cols[subCodeIdx] || 'SUB01',
      subject_name: subNameIdx !== -1 && cols[subNameIdx] ? cols[subNameIdx] : 'Course Module',
      marks_obtained: marks,
      max_marks: maxMarks,
      grade
    });
  }

  if (studentOrder.length === 0) {
    throw new Error('No valid student rows found in CSV.');
  }

  const processedStudents: StudentResult[] = [];
  const leafHashes: string[] = [];

  for (const roll of studentOrder) {
    const s = studentsMap[roll];
    const totalMarks = s.subjects.reduce((sum, sub) => sum + sub.marks_obtained, 0);
    const maxTotal = s.subjects.reduce((sum, sub) => sum + sub.max_marks, 0);
    const gpa = maxTotal > 0 ? parseFloat(((totalMarks / maxTotal) * 10).toFixed(2)) : 0;
    const hasFail = s.subjects.some(sub => sub.grade === 'F' || sub.marks_obtained < 0.4 * sub.max_marks);
    const resultStatus: 'PASS' | 'FAIL' = hasFail ? 'FAIL' : 'PASS';
    const salt = (await sha256(`lpu-salt-${roll}`)).substring(0, 8);

    const studentResult: StudentResult = {
      roll_no: s.roll_no,
      student_name: s.student_name,
      course: s.course,
      semester: s.semester,
      academic_year: s.academic_year,
      subjects: s.subjects,
      total_marks: totalMarks,
      max_total: maxTotal,
      gpa,
      result_status: resultStatus,
      salt,
      leaf_hash: ''
    };

    const leafHash = await computeLeafHash(studentResult);
    studentResult.leaf_hash = leafHash;
    leafHashes.push(leafHash);
    processedStudents.push(studentResult);
  }

  const tree = await buildClientMerkleTree(leafHashes);
  const rootHash = tree.root;
  const publishedAt = new Date().toISOString();

  const proofs: Record<string, MerkleProofResponse> = {};
  processedStudents.forEach((student, idx) => {
    proofs[student.roll_no] = {
      roll_no: student.roll_no,
      leaf_hash: student.leaf_hash,
      leaf_index: idx,
      root_hash: rootHash,
      published_at: publishedAt,
      audit_path: tree.getProof(idx),
      is_valid: true
    };
  });

  return {
    batch_id: `batch-${Math.random().toString(16).substring(2, 10)}`,
    total_students: processedStudents.length,
    root_hash: rootHash,
    published_at: publishedAt,
    sample_roll_no: processedStudents[0]?.roll_no || '2024CS001',
    students: processedStudents,
    proofs
  };
}

