"""
Deterministic Binary Merkle Tree Implementation for VeriMark
Compliant with standard cryptographic audit paths and portable to client-side JS/TS.
"""

import hashlib
from typing import List, Dict, Any, Tuple, Optional


def hash_pair(left: str, right: str) -> str:
    """
    Combines two SHA-256 hex digests deterministically.
    Uses UTF-8 string concatenation: SHA256(left + right)
    """
    combined = left.lower() + right.lower()
    return hashlib.sha256(combined.encode("utf-8")).hexdigest().lower()


class MerkleTree:
    def __init__(self, leaf_hashes: List[str]):
        """
        Builds a binary Merkle Tree from a list of leaf hex hashes.
        If leaf_hashes is empty, root is an empty string.
        """
        if not leaf_hashes:
            self.leaves = []
            self.levels = [[]]
            self.root = ""
            return

        self.leaves = [h.lower() for h in leaf_hashes]
        self.levels = [self.leaves]
        self._build_tree()

    def _build_tree(self) -> None:
        current_level = self.leaves
        while len(current_level) > 1:
            next_level = []
            # If odd number of nodes, duplicate the last node
            if len(current_level) % 2 != 0:
                current_level = current_level + [current_level[-1]]

            for i in range(0, len(current_level), 2):
                parent = hash_pair(current_level[i], current_level[i + 1])
                next_level.append(parent)

            self.levels.append(next_level)
            current_level = next_level

        self.root = current_level[0] if current_level else ""

    def get_root(self) -> str:
        return self.root

    def get_proof(self, leaf_index: int) -> List[Dict[str, str]]:
        """
        Generates Merkle Inclusion Proof (audit path) for a given leaf index.
        Returns a list of dicts: [{"position": "left" | "right", "hash": "..."}]
        """
        if leaf_index < 0 or leaf_index >= len(self.leaves):
            raise IndexError(f"Leaf index {leaf_index} out of bounds (0..{len(self.leaves)-1})")

        proof = []
        idx = leaf_index

        for level_idx in range(len(self.levels) - 1):
            level = self.levels[level_idx]
            # Ensure level was padded to even if it was odd during build
            if len(level) % 2 != 0:
                level = level + [level[-1]]

            is_right_child = (idx % 2 == 1)
            sibling_idx = idx - 1 if is_right_child else idx + 1

            sibling_hash = level[sibling_idx]
            position = "left" if is_right_child else "right"

            proof.append({
                "position": position,
                "hash": sibling_hash
            })

            idx = idx // 2

        return proof


def verify_merkle_proof(leaf_hash: str, proof: List[Dict[str, str]], expected_root: str) -> bool:
    """
    Verifies if a given leaf hash belongs to the Merkle tree with root expected_root.
    Operates iteratively along the audit path.
    """
    current_hash = leaf_hash.lower()

    for step in proof:
        sibling_hash = step["hash"].lower()
        position = step["position"]

        if position == "right":
            current_hash = hash_pair(current_hash, sibling_hash)
        elif position == "left":
            current_hash = hash_pair(sibling_hash, current_hash)
        else:
            raise ValueError(f"Invalid proof position: {position}")

    return current_hash.lower() == expected_root.lower()
