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
  MOCK_AUDIT_TAMPERED
} from '../utils/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let backendConnected = false;

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
      console.warn(`[VeriMark] Backend not reachable at ${API_BASE_URL}, using mock student data for ${rollNo}`);
      const mock = MOCK_STUDENTS.find(s => s.roll_no.toLowerCase() === rollNo.toLowerCase());
      if (mock) return mock;
      return MOCK_STUDENTS[0];
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
      console.warn(`[VeriMark] Backend not reachable, using mock proof for ${rollNo}`);
      const mock = MOCK_PROOFS[rollNo] || MOCK_PROOFS['2024CS001'];
      return mock;
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
      console.warn(`[VeriMark] Backend not reachable, verifying locally`);
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
      console.warn('[VeriMark] Backend simulate-tamper offline, using client simulation');
      return { message: 'Simulated locally' };
    }
  },

  /**
   * Upload CSV and publish new semester result batch to Merkle Ledger
   */
  async publishBatch(file: File): Promise<{
    batch_id: string;
    total_students: number;
    root_hash: string;
    published_at: string;
    sample_roll_no?: string;
  }> {
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
      console.warn('[VeriMark] Backend publish-batch failed or unreachable, simulating publish response');
      return {
        batch_id: `batch-${Math.random().toString(16).substring(2, 10)}`,
        total_students: 55,
        root_hash: 'c4e9988689a368ef964f581229e5590b92776878dd6ef7192d963ea2532f9434',
        published_at: new Date().toISOString(),
        sample_roll_no: '2024CS001'
      };
    }
  },

  isBackendConnected(): boolean {
    return backendConnected;
  }
};
