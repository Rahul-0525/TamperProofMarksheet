"""
VeriMark Cryptographic Engine
Provides deterministic Merkle Tree generation, proof verification, and Ed25519 dual-signature governance.
"""

from .merkle import MerkleTree, verify_merkle_proof
from .signatures import generate_keypair, sign_message, verify_signature

__all__ = [
    "MerkleTree",
    "verify_merkle_proof",
    "generate_keypair",
    "sign_message",
    "verify_signature",
]
