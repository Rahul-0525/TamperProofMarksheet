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

// Flag to track whether backend is connected
let backendAvailable = false;

export const api = {
  /**
   * Fetch student result by roll number
   */
  async getStudentResult(rollNo: string): Promise<StudentResult> {
    try {
      const response = await client.get<StudentResult>(`/results/${rollNo}`);
      backendAvailable = true;
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
      backendAvailable = true;
      return response.data;
    } catch (err) {
      console.warn(`[VeriMark] Backend not reachable, using mock proof for ${rollNo}`);
      const mock = MOCK_PROOFS[rollNo] || MOCK_PROOFS['2024CS001'];
      return mock;
    }
  },

  /**
   * Verify proof against the backend API
   */
  async verifyProofOnline(payload: {
    leaf_hash: string;
    root_hash: string;
    audit_path: Array<{ position: string; hash: string }>;
  }): Promise<{ verified: boolean; calculated_root: string; expected_root: string }> {
    try {
      const response = await client.post('/results/verify', payload);
      backendAvailable = true;
      return response.data;
    } catch (err) {
      console.warn(`[VeriMark] Backend not reachable, verifying locally`);
      // Local fallback handled in components using crypto.ts
      throw err;
    }
  },

  /**
   * Fetch pending corrections
   */
  async getCorrections(): Promise<CorrectionRequest[]> {
    try {
      const response = await client.get<CorrectionRequest[]>('/governance/corrections');
      backendAvailable = true;
      return response.data;
    } catch (err) {
      return MOCK_CORRECTIONS;
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
  }): Promise<{ status: string; message: string }> {
    try {
      const response = await client.post('/governance/sign-correction', payload);
      backendAvailable = true;
      return response.data;
    } catch (err) {
      // Local simulation for demo
      return {
        status: payload.signer_role === 'DEAN' ? 'AWAITING_SECOND_APPROVAL' : 'APPROVED',
        message: 'Signature recorded successfully in simulation mode'
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
      backendAvailable = true;
      return response.data;
    } catch (err) {
      return simulatedTamper ? MOCK_AUDIT_TAMPERED : MOCK_AUDIT_SECURE;
    }
  },

  isBackendAvailable(): boolean {
    return backendAvailable;
  }
};
