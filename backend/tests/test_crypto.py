"""
Unit Tests for Cryptographic Engine (Merkle Tree & Signatures)
"""

import sys
import os

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.crypto.merkle import MerkleTree, verify_merkle_proof, hash_pair
from app.crypto.signatures import generate_keypair, sign_message, verify_signature


def test_merkle_tree_construction_and_verification():
    # 5 sample leaf hashes
    leaves = [
        "a" * 64,
        "b" * 64,
        "c" * 64,
        "d" * 64,
        "e" * 64,
    ]
    tree = MerkleTree(leaves)
    root = tree.get_root()
    assert len(root) == 64
    assert root != ""

    # Test inclusion proof for each leaf
    for idx, leaf in enumerate(leaves):
        proof = tree.get_proof(idx)
        is_valid = verify_merkle_proof(leaf, proof, root)
        assert is_valid is True, f"Proof verification failed for leaf index {idx}"

    # Test tamper detection: corrupted leaf
    corrupted_leaf = "f" * 64
    assert verify_merkle_proof(corrupted_leaf, tree.get_proof(0), root) is False


def test_ed25519_signatures():
    priv, pub = generate_keypair()
    message = "Approve mark change for roll 2024CS001: CS501 from 70 to 85"
    
    sig = sign_message(message, priv)
    assert verify_signature(message, sig, pub) is True

    # Tampered message should fail
    tampered_msg = "Approve mark change for roll 2024CS001: CS501 from 70 to 99"
    assert verify_signature(tampered_msg, sig, pub) is False

    # Corrupted signature should fail
    corrupted_sig = ("00" if sig[:2] != "00" else "11") + sig[2:]
    assert verify_signature(message, corrupted_sig, pub) is False


if __name__ == "__main__":
    print("Running crypto tests...")
    test_merkle_tree_construction_and_verification()
    print("✓ Merkle tree tests passed!")
    try:
        test_ed25519_signatures()
        print("✓ Ed25519 signature tests passed!")
    except ImportError:
        print("Note: Install 'cryptography' library to run signature tests.")
    print("All crypto tests completed successfully!")
