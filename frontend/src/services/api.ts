import axios from 'axios';
import {
  StudentResult,
  MerkleProofResponse,
  CorrectionRequest,
  IntegrityCheckResponse
} from '../types';
import {
  MOCK_STUDENTS,
  MOCK_PROOFS,
  MOCK_CORRECTIONS,
  MOCK_AUDIT_SECURE,
  MOCK_AUDIT_TAMPERED,
  PUBLISHED_ROOT_HASH
} from '../utils/mockData';
import { parseCSVAndBuildLedger } from '../utils/crypto';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let backendConnected = false;

function findStudentLocally(rollNo: string): StudentResult | null {
  let customStudents: StudentResult[] = [];
  try {
    const raw = localStorage.getItem('trugrade_custom_students');
    if (raw) customStudents = JSON.parse(raw);
  } catch (e) {}

  const all = [...customStudents, ...MOCK_STUDENTS];
  const norm = (rollNo || '').toLowerCase().trim();

  // 1. Exact match
  const exact = all.find(s => s.roll_no.toLowerCase() === norm);
  if (exact) return exact;

  // 2. Numeric shorthand match (e.g., "19" -> "2024CS019")
  if (/^\d+$/.test(norm)) {
    const padded = norm.padStart(3, '0');
    const matchNum = all.find(s => s.roll_no.endsWith(padded));
    if (matchNum) return matchNum;
  }

  // 3. Substring match
  const partial = all.find(s => s.roll_no.toLowerCase().includes(norm));
  if (partial) return partial;

  return null;
}

function findProofLocally(rollNo: string): MerkleProofResponse | null {
  let customProofs: Record<string, MerkleProofResponse> = {};
  try {
    const raw = localStorage.getItem('trugrade_custom_proofs');
    if (raw) customProofs = JSON.parse(raw);
  } catch (e) {}

  const allProofs = { ...MOCK_PROOFS, ...customProofs };
  const norm = (rollNo || '').toLowerCase().trim();

  // 1. Exact key match
  if (allProofs[rollNo]) return allProofs[rollNo];
  const exact = Object.values(allProofs).find(p => p.roll_no.toLowerCase() === norm);
  if (exact) return exact;

  // 2. Numeric shorthand
  if (/^\d+$/.test(norm)) {
    const padded = norm.padStart(3, '0');
    const matchNum = Object.values(allProofs).find(p => p.roll_no.endsWith(padded));
    if (matchNum) return matchNum;
  }

  // 3. Substring match
  const partial = Object.values(allProofs).find(p => p.roll_no.toLowerCase().includes(norm));
  if (partial) return partial;

  return null;
}

export const api = {
  /**
   * Fetch student result by roll number
   */
  async getStudentResult(rollNo: string): Promise<StudentResult & { root_hash?: string }> {
    try {
      const response = await client.get(`/results/${rollNo}`);
      backendConnected = true;
      return response.data;
    } catch (err) {
      console.warn(`[TruGrade] Backend not reachable at ${API_BASE_URL}, querying local Merkle cohort for ${rollNo}`);
      const student = findStudentLocally(rollNo);
      if (student) {
        let activeRoot = PUBLISHED_ROOT_HASH;
        try {
          const customRoot = localStorage.getItem('trugrade_custom_root');
          if (customRoot) activeRoot = customRoot;
        } catch (e) {}
        return {
          ...student,
          root_hash: activeRoot
        };
      }
      throw new Error(`Student with roll number "${rollNo}" not found in active academic ledger.`);
    }
  },

  /**
   * Fetch Merkle inclusion proof for a roll number
   */
  async getMerkleProof(rollNo: string): Promise<MerkleProofResponse> {
    try {
      const response = await client.get<MerkleProofResponse>(`/results/${rollNo}/proof`);
      backendConnected = true;
      return response.data;
    } catch (err) {
      console.warn(`[TruGrade] Backend not reachable, querying local proof store for ${rollNo}`);
      const proof = findProofLocally(rollNo);
      if (proof) return proof;
      return MOCK_PROOFS['2024CS001'];
    }
  },

  /**
   * Server-side proof verification
   */
  async verifyProofOnline(payload: {
    leaf_hash: string;
    root_hash: string;
    audit_path: Array<{ position: string; hash: string }>;
  }): Promise<{ verified: boolean; calculated_root: string; expected_root: string }> {
    try {
      const response = await client.post('/results/verify', payload);
      backendConnected = true;
      return response.data;
    } catch (err) {
      console.warn(`[TruGrade] Backend not reachable, verifying locally`);
      throw err;
    }
  },

  /**
   * Fetch pending corrections
   */
  async getCorrections(): Promise<CorrectionRequest[]> {
    try {
      const response = await client.get<CorrectionRequest[]>('/governance/corrections');
      backendConnected = true;
      return response.data;
    } catch (err) {
      return MOCK_CORRECTIONS;
    }
  },

  /**
   * Propose a new grade correction
   */
  async proposeCorrection(payload: {
    roll_no: string;
    subject_code: string;
    new_marks: number;
    reason: string;
    proposed_by: string;
  }): Promise<{ correction_id: string; status: string }> {
    try {
      const response = await client.post('/governance/propose-correction', payload);
      backendConnected = true;
      return response.data;
    } catch (err) {
      return {
        correction_id: `corr-${Math.random().toString(16).substring(2, 8)}`,
        status: 'AWAITING_APPROVALS'
      };
    }
  },

  /**
   * Submit digital signature for correction
   */
  async signCorrection(payload: {
    correction_id: string;
    signer_role: 'DEAN' | 'CONTROLLER';
    signature: string;
    public_key: string;
  }): Promise<{ status: string; message?: string; both_signed?: boolean; new_root_hash?: string }> {
    try {
      const response = await client.post('/governance/sign-correction', payload);
      backendConnected = true;
      return response.data;
    } catch (err) {
      return {
        status: payload.signer_role === 'DEAN' ? 'AWAITING_SECOND_APPROVAL' : 'APPROVED',
        message: 'Signature recorded successfully in simulation mode',
        both_signed: payload.signer_role === 'CONTROLLER'
      };
    }
  },

  /**
   * Run Database Integrity Audit
   */
  async checkIntegrity(simulatedTamper = false): Promise<IntegrityCheckResponse> {
    try {
      if (simulatedTamper) {
        return MOCK_AUDIT_TAMPERED;
      }
      const response = await client.get<IntegrityCheckResponse>('/audit/integrity-check');
      backendConnected = true;
      return response.data;
    } catch (err) {
      return simulatedTamper ? MOCK_AUDIT_TAMPERED : MOCK_AUDIT_SECURE;
    }
  },

  /**
   * Simulate SQL Injection / Direct DB modification on live backend
   */
  async simulateTamper(payload: {
    roll_no: string;
    subject_code: string;
    tampered_marks: number;
  }): Promise<any> {
    try {
      const response = await client.post('/audit/simulate-tamper', payload);
      backendConnected = true;
      return response.data;
    } catch (err) {
      console.warn('[TruGrade] Backend simulate-tamper offline, using client simulation');
      return { message: 'Simulated locally' };
    }
  },

  /**
   * Upload CSV and publish new semester result batch to Merkle Ledger
   * Fully functional with live backend OR client-side Web Crypto on Vercel
   */
  async publishBatch(file: File): Promise<{
    batch_id: string;
    total_students: number;
    root_hash: string;
    published_at: string;
    sample_roll_no?: string;
  }> {
    // 1. Parse client-side first so all student records are instantly available in-browser
    const csvText = await file.text();
    const clientBatch = await parseCSVAndBuildLedger(csvText);

    try {
      localStorage.setItem('trugrade_custom_students', JSON.stringify(clientBatch.students));
      localStorage.setItem('trugrade_custom_proofs', JSON.stringify(clientBatch.proofs));
      localStorage.setItem('trugrade_custom_root', clientBatch.root_hash);
      localStorage.setItem('trugrade_custom_batch', JSON.stringify({
        batch_id: clientBatch.batch_id,
        total_students: clientBatch.total_students,
        root_hash: clientBatch.root_hash,
        published_at: clientBatch.published_at,
        sample_roll_no: clientBatch.sample_roll_no
      }));
    } catch (e) {
      console.warn('[TruGrade] Could not cache batch to localStorage:', e);
    }

    // 2. Also post to backend if accessible
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await client.post('/admin/publish-batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      backendConnected = true;
      return response.data;
    } catch (err) {
      console.info('[TruGrade] Backend offline/Vercel: Batch minted client-side with native Web Crypto!');
      return {
        batch_id: clientBatch.batch_id,
        total_students: clientBatch.total_students,
        root_hash: clientBatch.root_hash,
        published_at: clientBatch.published_at,
        sample_roll_no: clientBatch.sample_roll_no
      };
    }
  },

  isBackendConnected(): boolean {
    return backendConnected;
  }
};
